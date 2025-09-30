import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/home";
import { RoomDetails } from "./pages/create-room";
import { Room } from "./pages/room";

const queryClient = new QueryClient();

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Routes>
					<Route element={<Home />} index />
					<Route path="/room/:roomId" element={<RoomDetails />} />
					<Route path="/room/:roomId/audio" element={<Room />} />
				</Routes>
			</BrowserRouter>
		</QueryClientProvider>
	);
}
