import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomDetails } from "./pages/create-room";
import { Home } from "./pages/home";
import { RecordRoomAudio } from "./pages/record-room-audio";
import { Room } from "./pages/room";

const queryClient = new QueryClient();

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<Home />} index />
					<Route element={<RoomDetails />} path="/room/:roomId" />
					<Route element={<RecordRoomAudio />} path="/room/:roomId/audio" />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
