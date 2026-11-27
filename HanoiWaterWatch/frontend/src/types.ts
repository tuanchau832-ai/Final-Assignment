export type LocalText = string | {
    en: string;
    vi: string;
};
export type Status = 'normal' | 'abnormal' | 'sensor_fault' | 'offline' | 'unavailable' | 'degraded';
export interface Sensor {
    channel: string;
    uid: string;
    unit: string;
    decimals: number;
    model_node: string;
    value: number | null;
    measured_at: string | null;
    status: Status;
    last_valid: {
        value: number;
        measured_at: string;
    } | null;
    fault_reason: string | null;
    active_alert_id: number | null;
}
export interface Station {
    lifecycle?: 'active' | 'maintenance' | 'archived';
    code: string;
    name: LocalText;
    river: string;
    location: {
        lat: number;
        lng: number;
    };
    data_mode: string;
    sensors?: Array<Sensor & {
        label?: LocalText;
        wokwi?: {
            pin: string;
            part_id: string;
        };
    }>;
}
export interface Snapshot {
    station_code: string;
    version: number;
    generated_at: string;
    station_status: Status;
    last_frame_at: string | null;
    session: {
        source: string;
        id: string;
    } | null;
    sensors: Sensor[];
    open_alert_count: number;
}
export interface Alert {
    id: number;
    rule_code: string;
    rule_name: LocalText;
    station_code: string;
    sensor_uid: string | null;
    category: string;
    severity: string;
    evidence_class: string;
    is_preliminary: boolean;
    review_status: string;
    opened_at: string;
    cleared_at: string | null;
    observed_value: number | null;
    unit: string;
    baseline_value?: number | null;
    threshold_value?: number | null;
    basis_snapshot?: {
        basis_text?: LocalText;
        basis_status?: string;
    };
    events?: Array<{
        type: string;
        at: string;
        actor?: string;
        data?: {
            note?: string;
        };
    }>;
    review?: {
        id: number;
        status: string;
        outcome?: string;
    };
}
export interface History {
    points: Array<{
        t: string;
        v: number | null;
        min: number | null;
        max: number | null;
        n: number;
        faults: number;
    }>;
    bucket: string;
    unit: string;
    decimals: number;
}
export interface User {
    username: string;
    display_name: string;
    role: string;
}
