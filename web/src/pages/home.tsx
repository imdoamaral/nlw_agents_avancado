import { CreateRoomForm } from "@/components/create-room-form";
import { RoomList } from "@/components/room-list";

export function Home() {
	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-4xl px-4 py-8">
				<div className="mb-8">
					<h1 className="mb-2 font-bold text-3xl text-foreground">
						Let me Ask
					</h1>
					<p className="text-muted-foreground">
						Crie salas para fazer perguntas e receber respostas com IA
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					<CreateRoomForm />
					<RoomList />
				</div>
			</div>
		</div>
	);
}
