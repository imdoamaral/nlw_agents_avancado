import { useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

// O navegador do usuario suporte/tem api de gravaçao?
const isRecordingSupported =
	!!navigator.mediaDevices && // !! = boolean()
	typeof navigator.mediaDevices.getUserMedia === "function" &&
	typeof window.MediaRecorder === "function";

type RoomParams = {
	roomId: string;
};

export function RecordRoomAudio() {
	const params = useParams<RoomParams>();
	const [isRecording, setIsRecording] = useState(false); // const [a, b] -> a: o estado em si e b: funçao para alterar esse estado
	const recorder = useRef<MediaRecorder | null>(null); // o hook 'useRef' possibilita usar a var 'recorder' como global
	const intervalRef = useRef<number | null>(null);

	function stopRecording() {
		setIsRecording(false);

		if (recorder.current && recorder.current.state !== "inactive") {
			recorder.current.stop();
		}

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	}

	function createrecorder(audio: MediaStream) {
		recorder.current = new MediaRecorder(audio, {
			mimeType: "audio/webm",
			audioBitsPerSecond: 64_000,
		});

		recorder.current.ondataavailable = (event) => {
			if (event.data.size > 0) {
				uploadAudio(event.data);
			}
		};

		recorder.current.onstart = () => {
			console.log("Gravação iniciada!");
		};

		recorder.current.onstop = () => {
			console.log("Gravação encerrada/pausada");
		};

		recorder.current.start();
	}

	async function uploadAudio(audio: Blob) {
		// Enviando dados do front pro backend: formData (melhor opçao)
		const formData = new FormData();

		formData.append("file", audio, "audio.webm");

		const response = await fetch(
			`http://localhost:3333/rooms/${params.roomId}/audio`,
			{
				method: "POST",
				body: formData,
			},
		);

		const result = await response.json();
		console.log(result);
	}

	async function startRecording() {
		if (!isRecordingSupported) {
			alert("O seu navegador não suporta gravação.");
			return;
		}

		setIsRecording(true);

		const audio = await navigator.mediaDevices.getUserMedia({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				sampleRate: 44_100,
			},
		});

		createrecorder(audio);

		intervalRef.current = setInterval(() => {
			recorder.current?.stop();

			createrecorder(audio);
		}, 5000);
	}

	if (!params.roomId) {
		return <Navigate replace to="/" />;
	}

	return (
		<div className="flex h-screen items-center justify-center gap-3 flex-col">
			{isRecording ? (
				<Button onClick={stopRecording}>Pausar gravação</Button>
			) : (
				<Button onClick={startRecording}>Gravar áudio</Button>
			)}

			{isRecording ? <p>Gravando...</p> : <p>Pausado</p>}
		</div>
	);
}
