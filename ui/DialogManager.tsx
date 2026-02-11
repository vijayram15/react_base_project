// DialogManager.tsx
import React, { useEffect, useRef } from "react";
import { create } from "zustand";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type DialogType = "ok" | "confirm" | "custom";
type DialogSize = "small" | "standard" | "large";
type Severity = "none" | "info" | "success" | "error" | "warning";
type BulletStyle = "disk" | "circle" | "square" | "none" | "number" | "alpha";

interface ActiveDialog {
  open: boolean;
  type: DialogType;
  size: DialogSize;
  title?: string;
  content?: React.ReactNode; // always JSX/TSX
  severity: Severity;
  list?: boolean;
  messages?: string[];
  bulletConfig?: BulletStyle;
  onOk?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  customActions?: React.ReactNode;
  sx?: object;
  resolvePromise?: (value: boolean) => void;
}

interface DialogStore {
  active: ActiveDialog | null;
  showOkDialog: (messages?: string[], config?: Partial<ActiveDialog>) => void;
  showConfirm: (messages?: string[], config?: Partial<ActiveDialog>) => Promise<boolean>;
  showErrors: (messages?: string[], config?: Partial<ActiveDialog>) => void;
  closeDialog: () => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  active: null,

  showOkDialog: (messages = [], config = {}) =>
    set({
      active: {
        open: true,
        type: "ok",
        size: config.size ?? "standard",
        severity: config.severity ?? "none",
        list: config.list ?? (messages.length > 0),
        bulletConfig: config.bulletConfig ?? "disk",
        messages,
        ...config,
      },
    }),

  showConfirm: (messages = [], config = {}) =>
    new Promise<boolean>((resolve) => {
      set({
        active: {
          open: true,
          type: "confirm",
          size: config.size ?? "standard",
          severity: config.severity ?? "none",
          list: config.list ?? (messages.length > 0),
          bulletConfig: config.bulletConfig ?? "disk",
          messages,
          resolvePromise: resolve,
          ...config,
        },
      });
    }),

  showErrors: (messages = [], config = {}) =>
    set({
      active: {
        open: true,
        type: "ok",
        size: config.size ?? "standard",
        severity: "error", // fixed
        list: true,
        bulletConfig: config.bulletConfig ?? "disk",
        messages,
        title: config.title ?? "Error(s)",
        ...config,
      },
    }),

  closeDialog: () => set({ active: null }),
}));

export default function DialogManager() {
  const { active, closeDialog } = useDialogStore();
  const theme = useTheme();
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active?.open && firstButtonRef.current) {
      firstButtonRef.current.focus();
    }
  }, [active]);

  if (!active?.open) return null;

  const {
    type,
    size,
    title,
    content,
    severity,
    list,
    messages,
    bulletConfig,
    onOk,
    onConfirm,
    onCancel,
    customActions,
    sx,
    resolvePromise,
  } = active;

  const sizeMap = {
    small: { maxWidth: 400, maxHeight: 300 },
    standard: { maxWidth: 600, maxHeight: 500 },
    large: { maxWidth: "90%", maxHeight: "90%" },
  };

  const severityColorMap: Record<Severity, string> = {
    none: theme.palette.grey[800],
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
  };

  const fallbackTitle: Record<Severity, string> = {
    none: "Message",
    info: "Information",
    success: "Success",
    error: "Error(s)",
    warning: "Warning",
  };

  const dialogTitle = title ?? fallbackTitle[severity];

  const handleClose = () => {
    if (type === "confirm" && resolvePromise) resolvePromise(false);
    closeDialog();
  };

  const handleConfirm = () => {
    onConfirm?.();
    if (resolvePromise) resolvePromise(true);
    closeDialog();
  };

  const handleCancel = () => {
    onCancel?.();
    if (resolvePromise) resolvePromise(false);
    closeDialog();
  };

  const handleOk = () => {
    onOk?.();
    closeDialog();
  };

  // Render content
  let renderedContent: React.ReactNode = null;
  if (list && messages && messages.length > 0) {
    const listStyle =
      bulletConfig === "none"
        ? "none"
        : bulletConfig === "number"
        ? "decimal"
        : bulletConfig === "alpha"
        ? "upper-alpha"
        : bulletConfig; // disk, circle, square

    renderedContent = (
      <List sx={{ listStyleType: listStyle }}>
        {messages.map((msg, i) => (
          <ListItem key={i} sx={{ display: "list-item" }}>
            <ListItemText primary={msg} />
          </ListItem>
        ))}
      </List>
    );
  } else {
    renderedContent = content ?? null;
  }

  return (
    <Dialog
      open={active.open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          width: sizeMap[size].maxWidth,
          height: sizeMap[size].maxHeight,
          zIndex: theme.zIndex.modal + 1,
        },
        ...sx,
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: severityColorMap[severity],
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {dialogTitle}
        {type === "custom" && (
          <IconButton onClick={handleClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>

      <DialogContent>{renderedContent}</DialogContent>

      <DialogActions>
        {type === "ok" && (
          <Button ref={firstButtonRef} onClick={handleOk}>
            Ok
          </Button>
        )}

        {type === "confirm" && (
          <>
            <Button ref={firstButtonRef} onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </>
        )}

        {type === "custom" && customActions}
      </DialogActions>
    </Dialog>
  );
}

export { useDialogStore };







import { useDialogStore } from "./DialogManager";

function Demo() {
  const { showOkDialog, showConfirm, showErrors } = useDialogStore();

  const handleInfo = () =>
    showOkDialog(["This is an info message"], { severity: "info" });

  const handleErrors = () =>
    showErrors(
      ["Invalid interest rate", "Check loan amount"],
      { bulletConfig: "number" }
    );

  const handleConfirm = async () => {
    const result = await showConfirm(
      ["Do you want to proceed?", "This action cannot be undone"],
      { severity: "warning", bulletConfig: "alpha" }
    );
    console.log("User choice:", result);
  };

  return (
    <>
      <button onClick={handleInfo}>Show Info</button>
      <button onClick={handleErrors}>Show Errors</button>
      <button onClick={handleConfirm}>Show Confirm</button>
    </>
  );
        }
