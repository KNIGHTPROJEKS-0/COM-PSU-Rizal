import * as protobuf from "protobufjs";

// Protobuf message definitions for the COM-PSU-Rizal system
const PROTO_DEFINITIONS = {
  // User data message
  UserMessage: `
    syntax = "proto3";
    package com.psu.rizal;
    
    message UserMessage {
      string id = 1;
      string email = 2;
      string name = 3;
      string role = 4;
      int64 created_at = 5;
      int64 updated_at = 6;
      bool is_active = 7;
    }
  `,

  // Document data message
  DocumentMessage: `
    syntax = "proto3";
    package com.psu.rizal;
    
    message DocumentMessage {
      string id = 1;
      string title = 2;
      string content = 3;
      string author_id = 4;
      string type = 5;
      int64 created_at = 6;
      int64 updated_at = 7;
      repeated string tags = 8;
      bool is_public = 9;
    }
  `,

  // Meeting data message
  MeetingMessage: `
    syntax = "proto3";
    package com.psu.rizal;
    
    message MeetingMessage {
      string id = 1;
      string title = 2;
      string description = 3;
      string host_id = 4;
      int64 start_time = 5;
      int64 end_time = 6;
      string status = 7;
      repeated string participant_ids = 8;
      string meeting_url = 9;
    }
  `,

  // Analytics data message
  AnalyticsMessage: `
    syntax = "proto3";
    package com.psu.rizal;
    
    message AnalyticsMessage {
      string metric_name = 1;
      double value = 2;
      int64 timestamp = 3;
      map<string, string> metadata = 4;
    }
  `,
};

// Cached message types
const messageTypes: { [key: string]: protobuf.Type } = {};

/**
 * Initialize protobuf message types
 */
export async function initProtobufTypes(): Promise<void> {
  try {
    for (const [name, definition] of Object.entries(PROTO_DEFINITIONS)) {
      const root = protobuf.parse(definition).root;
      const messageType = root.lookupType(
        `com.psu.rizal.${name.replace("Message", "")}`,
      );
      messageTypes[name] = messageType;
    }
  } catch (error) {
    console.error("Failed to initialize protobuf types:", error);
    throw error;
  }
}

/**
 * Serialize data to protobuf buffer
 */
export function serializeToProtobuf<T extends { [k: string]: any }>(
  messageName: string,
  data: T,
): Uint8Array {
  const messageType = messageTypes[messageName];
  if (!messageType) {
    throw new Error(`Message type ${messageName} not found`);
  }

  try {
    const message = messageType.create(data);
    return messageType.encode(message).finish();
  } catch (error) {
    console.error(`Failed to serialize ${messageName}:`, error);
    throw error;
  }
}

/**
 * Deserialize protobuf buffer to data
 */
export function deserializeFromProtobuf<T>(
  messageName: string,
  buffer: Uint8Array,
): T {
  const messageType = messageTypes[messageName];
  if (!messageType) {
    throw new Error(`Message type ${messageName} not found`);
  }

  try {
    const message = messageType.decode(buffer);
    return messageType.toObject(message) as T;
  } catch (error) {
    console.error(`Failed to deserialize ${messageName}:`, error);
    throw error;
  }
}

/**
 * Serialize user data
 */
export function serializeUser(user: any): Uint8Array {
  return serializeToProtobuf("UserMessage", user);
}

/**
 * Deserialize user data
 */
export function deserializeUser(buffer: Uint8Array): any {
  return deserializeFromProtobuf("UserMessage", buffer);
}

/**
 * Serialize document data
 */
export function serializeDocument(document: any): Uint8Array {
  return serializeToProtobuf("DocumentMessage", document);
}

/**
 * Deserialize document data
 */
export function deserializeDocument(buffer: Uint8Array): any {
  return deserializeFromProtobuf("DocumentMessage", buffer);
}

/**
 * Serialize meeting data
 */
export function serializeMeeting(meeting: any): Uint8Array {
  return serializeToProtobuf("MeetingMessage", meeting);
}

/**
 * Deserialize meeting data
 */
export function deserializeMeeting(buffer: Uint8Array): any {
  return deserializeFromProtobuf("MeetingMessage", buffer);
}

/**
 * Serialize analytics data
 */
export function serializeAnalytics(analytics: any): Uint8Array {
  return serializeToProtobuf("AnalyticsMessage", analytics);
}

/**
 * Deserialize analytics data
 */
export function deserializeAnalytics(buffer: Uint8Array): any {
  return deserializeFromProtobuf("AnalyticsMessage", buffer);
}

/**
 * Create a protobuf service client
 */
export function createProtobufService(serviceName: string, methods: string[]) {
  const serviceDefinition = `
    syntax = "proto3";
    package com.psu.rizal;
    
    service ${serviceName} {
      ${
    methods.map((method) =>
      `rpc ${method} (${method}Request) returns (${method}Response);`
    ).join("\n      ")
  }
    }
    
    ${
    methods.map((method) => `
    message ${method}Request {
      string data = 1;
    }
    
    message ${method}Response {
      string result = 1;
      bool success = 2;
      string error = 3;
    }
    `).join("\n")
  }
  `;

  const root = protobuf.parse(serviceDefinition).root;
  return root.lookupService(serviceName);
}

/**
 * Convert JSON to protobuf and back for comparison
 */
export function compareSerializationSizes(data: any, messageName: string): {
  jsonSize: number;
  protobufSize: number;
  compressionRatio: number;
} {
  const jsonString = JSON.stringify(data);
  const jsonSize = new TextEncoder().encode(jsonString).length;

  const protobufBuffer = serializeToProtobuf(messageName, data);
  const protobufSize = protobufBuffer.length;

  const compressionRatio = jsonSize / protobufSize;

  return {
    jsonSize,
    protobufSize,
    compressionRatio,
  };
}

/**
 * Batch serialize multiple messages
 */
export function batchSerialize<T extends { [k: string]: any }>(
  messageName: string,
  dataArray: T[],
): Uint8Array[] {
  return dataArray.map((data) => serializeToProtobuf(messageName, data));
}

/**
 * Batch deserialize multiple messages
 */
export function batchDeserialize<T>(
  messageName: string,
  buffers: Uint8Array[],
): T[] {
  return buffers.map((buffer) =>
    deserializeFromProtobuf<T>(messageName, buffer)
  );
}
