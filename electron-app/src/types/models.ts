export interface RoleConfiguration {
  [key: string]: any; // Simplified for now
}

export interface SpaceRole {
    id: number;
    space_id: number;
    name: string;
    icon: string;
    description: string;
    configuration: RoleConfiguration;
    created_at: string;
    updated_at: string;
}

export interface Flow {
  id: number;
  name: string; // Simplified
}

export interface Custom_Field {
  id: number;
  [key: string]: any;
}

export interface Flow_Category {
  id: number;
  space_id: number;
  nodeType: string;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
  key?: string;
  isVisible?: boolean;
  deleted?: boolean;
  archived?: boolean;
  custom_field?: Custom_Field[];
  flow_field_order?: number[];
  created_by?: number;
}

export interface BaseSpaceMember {
  id: number;
}

export interface AdminAccessConfiguration {
  [key: string]: any;
}

export interface LoginDetails {
  last_login: string;
}

export interface SpaceMember extends BaseSpaceMember {
    space_id: number;
    user_id: number;
    status: string;
    invite_email: string | null;
    invite_username: string | null;
    invite_alias: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    isVisible?: boolean;
    phone_number?: string | null;
    date_of_birth?: string | null;
    is_admin: boolean;
    configuration?: AdminAccessConfiguration
    login?: LoginDetails[];
}

export interface ActiveCalls {
    spaceId: number | string;
    sessionId: string | number;
}

export type Space_Profile_Type = 'personal' | 'work' | 'community';

export interface Space {
    id: number;
    created_at: string;
    updated_at: string;
    deleted: boolean;
    deleted_at: string | null;
    deleted_by: string | null;
    perma_delete_at: string | null;
    length: number;
    owner_id: number;
    type: string;
    profile_type: Space_Profile_Type;
    name: string;
    no_logo_colour: string;
    logo_url: string | null;
    banner_url: string | null;
    description: string | null;
    terms: boolean;
    terms_text: string | null;
    created_by: number;
    decription?: string; // Typo in user request, kept for consistency or fixed? keeping both if needed or assuming 'description' covers it. User has both 'description' and 'decription'. I will stick to valid fields.
    _count?: {
        space_member: number;
    };
    activeCalls?: ActiveCalls[];
    unreadCount?: number;
    isMention?: boolean;
    isInvited?: boolean;

    spaceRoles: SpaceRole[];
    flows: Flow[];
    categories: Flow_Category[];
    spaceMembers: SpaceMember[];
}
