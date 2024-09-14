declare namespace App.Data {
export type ActionState = {
actionRetries: number;
comprehensionScore: number;
recipeConfidence: number;
complexity: number;
capabilityMatch: number;
continuedConvo: boolean;
shouldNavigate: number;
sequence: Array<any> | null;
refused: boolean;
unrelated: boolean;
command: string | null;
escalationService: string | null;
escalationReady: boolean;
rag: Array<any>;
data: Array<any>;
ragQueries: Array<any>;
activePluginSlugs: Array<any>;
rePlugin: string | null;
capability: App.Data.CapabilityData | null;
intent_id: number | null;
navigation: Array<any>;
moderation: Array<any>;
jailbreakAttempt: number;
};
export type AgentActionData = {
id: string;
created_at: string;
action: any | null;
result: Array<any> | null;
recipe_idx: number | null;
final: boolean;
hasExecuted: boolean;
};
export type CapabilityData = {
slug: string;
name: string;
description: string;
};
export type ConfigData = {
abilities: Array<any>;
context_awareness: Array<any>;
capabilities: Array<any>;
convo_only: boolean;
convo_disabled: boolean;
token_limit: number;
token_limit_per_site: number;
token_limit_per_user: number;
};
export type ConversationData = {
id: string;
message: string;
created_at: string;
human_created_at: string;
wp_user_id: number;
agent_actions: Array<App.Data.AgentActionData>;
feedback: any | null;
status: App.Enums.UserRequestStatus | null;
};
export type DocData = {
table: string;
id: number;
content: Array<any>;
schemas: Array<any>;
parent_id: number | null;
created_at: string | null;
updated_at: string | null;
meta: Array<any> | null;
};
export type DocIndexStatusData = {
id: number;
docType: string;
total: number;
indexed: number;
percent: number;
done: boolean;
status: App.Enums.DocIndexState;
};
export type FeedbackData = {
approved: boolean;
message: string;
};
export type HistoryData = {
conversationId: number;
userRequestId: number;
siteId: string;
userId: number;
wpUserId: number;
message: string;
conversationCreatedAt: string;
userRequestCreatedAt: string;
humanCreatedAt: string;
};
export type HybridSearchResultsData = {
query: App.Data.SearchQueryData;
total: number;
results: Array<App.Data.WpObjectData>;
};
export type IntentData = {
message: string;
embedding?: Array<any>;
};
export type PlanData = {
name: string;
slug: string;
priceYearly: number;
priceMonthly: number;
};
export type SearchQueryData = {
id: string;
query: string;
summary: string | null;
};
export type SearchResultData = {
object: App.Data.WpObjectData;
excerpt: string;
};
export type SearchResultsData = {
results: Array<App.Data.SearchResultData>;
totalResults: number;
};
export type SiteSettingData = {
name: App.Enums.SiteSettingValue;
value: any;
label: string;
};
export type TenantData = {
slug: string;
name: string;
created_at: string;
};
export type UserData = {
name: string;
email: string;
email_verified_at: string;
has_password: boolean;
};
export type WpObjectData = {
type: string;
id: number;
};
export type WpObjectResultData = {
objectId: string;
type: string;
id: number;
score: number;
};
export type WpSearchQueryData = {
query: string;
wpResults: Array<App.Data.WpObjectData>;
};
}
declare namespace App.Enums {
export type Ability = 'message' | 'query' | 'run' | 'code' | 'edit' | 'report' | 'navigate' | 'write_to_editor' | 'write_to_input';
export type BillingCycle = 'monthly' | 'yearly';
export type Command = '/gb';
export type ConfigType = 'abilities' | 'context_awareness' | 'capabilities' | 'convo_only' | 'convo_disabled' | 'token_limit' | 'token_limit_per_site' | 'token_limit_per_user';
export type ContextAwareness = 'screen' | 'site_health' | 'errors' | 'db_schema' | 'wordpress_public_information' | 'post';
export type DocIndexState = 0 | 1 | 2 | 3 | 4;
export type EmbedSchema = 'posts_combined' | 'post_simple' | 'post_title' | 'post_content' | 'post_comments' | 'post_meta';
export type LlmOption = 'json_response' | 'json_schema';
export type LlmProvider = 'anthropic' | 'azure_openai' | 'cohere' | 'google_vertex' | 'openai';
export type SiteChatSetting = 'web_enabled';
export type SiteSettingValue = 'convoOnly' | 'webEnabled' | 'visionEnabled';
export type TokenUsageStatus = 0 | 1 | 2 | 3;
export type UserRequestStatus = 'pending' | 'aborted' | 'completed';
}
declare namespace App.Llm.SelectedInput {
export type SelectedInputType = 'post_content' | 'post_title' | 'input';
}