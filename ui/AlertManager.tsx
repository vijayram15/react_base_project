import React, { useMemo, useEffect } from "react";
import { create } from "zustand";

// -------------------- Types --------------------
type Alert = {
  id: string;
  severity: "info" | "success" | "warning" | "error";
  message: string;
};

interface AlertStore {
  alertsByTarget: Record<string, Alert[]>;
  systemTargetId?: string;
  registerSystemTarget: (targetId: string) => void;
  createTarget: () => string;
  showAlert: (targetId: string, alert: Alert) => string;
  clearAlert: (targetId: string, id: string) => void;
  clearAll: (targetId: string) => void;
}

// -------------------- Store --------------------
let targetCounter = 0;

export const useAlertStore = create<AlertStore>((set) => ({
  alertsByTarget: {},
  systemTargetId: undefined,

  registerSystemTarget: (targetId) => set({ systemTargetId: targetId }),

  createTarget: () => {
    targetCounter += 1;
    return `target-${targetCounter}`;
  },

  showAlert: (targetId, alert) =>
    set((state) => {
      const id = alert.id ?? Date.now().toString();
      return {
        alertsByTarget: {
          ...state.alertsByTarget,
          [targetId]: [{ ...alert, id }], // replace old with new
        },
      };
    }),

  clearAlert: (targetId, id) =>
    set((state) => ({
      alertsByTarget: {
        ...state.alertsByTarget,
        [targetId]: (state.alertsByTarget[targetId] ?? []).filter(
          (a) => a.id !== id
        ),
      },
    })),

  clearAll: (targetId) =>
    set((state) => ({
      alertsByTarget: {
        ...state.alertsByTarget,
        [targetId]: [],
      },
    })),
}));

// -------------------- Hook --------------------
export function useAlert() {
  const store = useAlertStore.getState();

  const targetId = useMemo(() => store.createTarget(), []);

  const alerts = useAlertStore((s) => s.alertsByTarget[targetId] ?? []);
  const systemTargetId = useAlertStore((s) => s.systemTargetId);

  const showAlert = (
    message: string,
    severity: Alert["severity"] = "info",
    level: "system" | "container" = "container"
  ): string => {
    const alertId = Date.now().toString();
    const target =
      level === "system" && systemTargetId ? systemTargetId : targetId;
    store.showAlert(target, { id: alertId, severity, message });
    return alertId;
  };

  const clearAlert = (id: string) => store.clearAlert(targetId, id);
  const clearAll = () => store.clearAll(targetId);

  return { targetId, alerts, showAlert, clearAlert, clearAll };
}

// -------------------- Renderer --------------------
export function AlertTarget({
  targetId,
  isDefault = false,
}: {
  targetId: string;
  isDefault?: boolean;
}) {
  const alerts = useAlertStore((s) => s.alertsByTarget[targetId] ?? []);

  useEffect(() => {
    if (isDefault) {
      useAlertStore.getState().registerSystemTarget(targetId);
    }
  }, [isDefault, targetId]);

  if (!alerts.length) return null;

  const alert = alerts[0]; // only one active per target

  return (
    <div className={`alert ${alert.severity}`}>
      {alert.message}
    </div>
  );
}



import { useAlert, AlertTarget } from "./AlertManager";

function App() {
  const { targetId, showAlert } = useAlert();

  return (
    <>
      <AlertTarget targetId={targetId} isDefault />
      <button onClick={() => showAlert("System overload!", "warning", "system")}>
        Trigger System Alert
      </button>
    </>
  );
}


import { useAlert, AlertTarget } from "./AlertManager";

function MyModal() {
  const { targetId, showAlert } = useAlert();

  return (
    <div>
      <AlertTarget targetId={targetId} />
      <button onClick={() => showAlert("Form validation failed", "error")}>
        Trigger Modal Alert
      </button>
    </div>
  );
}
