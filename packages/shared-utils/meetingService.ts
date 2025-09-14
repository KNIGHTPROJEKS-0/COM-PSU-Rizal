import { supabase } from "../lib/supabaseClient";

interface Meeting {
  id: string;
  title: string;
  hostId: string;
  isActive: boolean;
  createdAt: string;
}

interface Participant {
  id: string;
  meetingId: string;
  name: string;
  socketId: string;
  isHost: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  joinedAt: string;
}

interface ChatMessage {
  id: string;
  meetingId: string;
  participantId: string;
  message: string;
  timestamp: string;
}

export class MeetingService {
  static async createMeeting(
    title: string,
    hostId: string,
  ): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .insert([
          {
            title,
            host_id: hostId,
            is_active: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating meeting:", error);
        return null;
      }

      return data as Meeting;
    } catch (error) {
      console.error("Error creating meeting:", error);
      return null;
    }
  }

  static async getMeeting(meetingId: string): Promise<Meeting | null> {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .eq("id", meetingId)
        .single();

      if (error) {
        console.error("Error getting meeting:", error);
        return null;
      }

      return data as Meeting;
    } catch (error) {
      console.error("Error getting meeting:", error);
      return null;
    }
  }

  static async addParticipant(
    meetingId: string,
    name: string,
    isHost: boolean = false,
  ): Promise<Participant | null> {
    try {
      const { data, error } = await supabase
        .from("participants")
        .insert([
          {
            meeting_id: meetingId,
            name,
            is_host: isHost,
            is_muted: false,
            is_camera_off: false,
            is_screen_sharing: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding participant:", error);
        return null;
      }

      return data as Participant;
    } catch (error) {
      console.error("Error adding participant:", error);
      return null;
    }
  }

  static async getParticipants(meetingId: string): Promise<Participant[]> {
    try {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("meeting_id", meetingId);

      if (error) {
        console.error("Error getting participants:", error);
        return [];
      }

      return data as Participant[];
    } catch (error) {
      console.error("Error getting participants:", error);
      return [];
    }
  }

  static async addChatMessage(
    meetingId: string,
    participantId: string,
    message: string,
  ): Promise<ChatMessage | null> {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([
          {
            meeting_id: meetingId,
            participant_id: participantId,
            message,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding chat message:", error);
        return null;
      }

      return data as ChatMessage;
    } catch (error) {
      console.error("Error adding chat message:", error);
      return null;
    }
  }

  static async getChatMessages(meetingId: string): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          *,
          participants(name)
        `)
        .eq("meeting_id", meetingId)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error getting chat messages:", error);
        return [];
      }

      // Map the data to include participant names
      return data.map((msg: any) => ({
        ...msg,
        participantName: msg.participants?.name || "Unknown",
      })) as ChatMessage[];
    } catch (error) {
      console.error("Error getting chat messages:", error);
      return [];
    }
  }
}
