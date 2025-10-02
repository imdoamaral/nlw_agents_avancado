import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateQuestionRequest } from "./types/create-question-request";
import type { CreateQuestionResponse } from "./types/create-questions-response";
import type { GetRoomQuestionsResponse } from "./types/get-room-questions-response";

export function useCreateQuestion(roomId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		// mutation = sempre que for criaçao, ediçao ou remoçao
		mutationFn: async (data: CreateQuestionRequest) => {
			const response = await fetch(
				`http://localhost:3333/rooms/${roomId}/questions`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				const errorData = await response.text();
				throw new Error(`Erro ${response.status}: ${errorData}`);
			}

			const result: CreateQuestionResponse = await response.json();

			return result;
		},

		// Executa no momento que for feita a chamada para a API
		onMutate({ question }) {
			const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
				"get-questions",
				roomId,
			]);

			const questionsArray = questions ?? [];

			const newQuestion = {
				id: crypto.randomUUID(),
				question,
				answer: null,
				createdAt: new Date().toISOString(),
				isGeneratingAsnwer: true,
			};

			queryClient.setQueryData<GetRoomQuestionsResponse>(
				["get-questions", roomId],
				[newQuestion, ...questionsArray],
			);

			return { newQuestion, questions }; // retorna a lista de perguntas antes de inserir a pergunta do usuario
		},

		onSuccess(data, _variables, context) {
			queryClient.setQueryData<GetRoomQuestionsResponse>(
				["get-questions", roomId],
				(questions) => {
					if (!questions) {
						return questions;
					}

					if (!context.newQuestion) {
						return questions;
					}

					return questions.map((question) => {
						if (question.id === context.newQuestion.id) {
							return {
								...context.newQuestion,
								id: data.questionId,
								answer: data.answer,
								isGeneratingAnswer: false,
							};
						}

						return question;
					});
				},
			);
		},

		onError(_error, _variables, context) {
			if (context?.questions) {
				queryClient.setQueryData<GetRoomQuestionsResponse>(
					["get-questions", roomId],
					context.questions,
				);
			}
		},

		// 	onSuccess: () => {
		// 		queryClient.invalidateQueries({ queryKey: ["get-rooms"] });
		// 	},
	});
}
