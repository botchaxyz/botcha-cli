// Evaluation checks (6 binary)
export interface EvalChecks {
  noncePresent: boolean;
  structureFollowed: boolean;
  stanceRespected: boolean;
  topicRelevance: boolean;
  reasoningDepth: boolean;
  minimumSubstance: boolean;
}

// On-chain credential
export interface Credential {
  verified: boolean;
  timestamp: bigint;
}

// API error
export interface ApiError {
  error: string;
}

// POST /api/v1/challenge
export interface OffchainChallengeRequest {
  agentId?: string;
}

export interface OffchainChallengeResponse {
  challengeId: string;
  prompt: string;
  expiresAt: number;
}

// POST /api/v1/verify
export interface OffchainVerifyRequest {
  challengeId: string;
  response: string;
  onchain?: {
    walletAddress: string;
    agentId?: number;
    ownership?: {
      message?: string;
      signature: string;
    };
    onlyLinkIfAlreadyVerified?: boolean;
  };
}

export interface OffchainVerifyResponse {
  verified: boolean;
  checks: EvalChecks;
  responseTime: number;
  receipt?: string;
  onchain?: V1CertifyResponse;
}

// Receipt JWT payload (decoded)
export interface ReceiptPayload {
  sub?: string;
  challengeId: string;
  iat: number;
  exp: number;
  iss: string;
}

// POST /api/v1/receipt/verify
export interface ReceiptVerifyRequest {
  receipt: string;
}

export interface ReceiptVerifyResponse {
  valid: boolean;
  agentId?: string;
  challengeId?: string;
  issuedAt?: number;
  expiresAt?: number;
  fresh?: boolean;
  suggestChallenge?: boolean;
}

// V1 Certify (on-chain via ERC-4337)
export interface V1CertifyRequest {
  receipt: string;
  walletAddress: string;
  agentId?: number;
  onlyLinkIfAlreadyVerified?: boolean;
}

export interface V1CertifyResponse {
  txHash: string;
  agent: string;
  erc8004?: {
    written: boolean;
    note?: string;
  };
  preflight?: {
    alreadyVerified: boolean;
    action: "register" | "link-only" | "skip";
  };
}

// Activity feed
export type ActivityEventType = "challenge" | "verified";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  agentId: string;
  challengeId?: string;
  timestamp: number;
}

export interface ActivityFeedResponse {
  events: ActivityEvent[];
  serverTime: number;
}

// Skill descriptor
export interface SkillPointerResponse {
  url: string;
  format: "markdown";
}

// Status endpoint
export type ChallengeState = "pending" | "verified" | "unknown";

export interface ChallengeStatusResponse {
  challengeId: string;
  state: ChallengeState;
  agentId?: string;
  issuedAt?: number;
  expiresAt?: number;
  verified?: boolean;
  checks?: EvalChecks;
  responseTime?: number;
  completedAt?: number;
}
