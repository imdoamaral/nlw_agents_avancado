import { useQuery } from "@tanstack/react-query";
import type { GetRoomsResponse } from "./types/get-room-response";

export function UseRooms() {
	return useQuery({
		// useQuery = sempre que for listagem
		queryKey: ["get-rooms"],
		queryFn: async () => {
			const response = await fetch("http://localhost:3333/rooms");
			const result: GetRoomsResponse = await response.json();

			return result;
		},
	});
}
