"use client";

import { useState, useEffect } from "react";
import {
  X,
  ArrowLeft,
  User,
  Shield,
  Sliders,
  Search,
  Lock,
  LogOut,
  Loader2,
  Check,
  Briefcase,
  BookOpen,
  Heart,
} from "lucide-react";
import type { Profile, ProfileIntent } from "@notter/types";
import { createProfileClient } from "@notter/api-client";
import { getApiBaseUrl } from "@/lib/env";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onProfileUpdate: (updated: Profile) => void;
  onSignOut: () => Promise<void>;
}

const intentOptions: { value: ProfileIntent; label: string; desc: string; icon: typeof Heart }[] = [
  { value: "personal", label: "Personal", desc: "Journaling, ideas, day-to-day notes", icon: Heart },
  { value: "work", label: "Work", desc: "Meeting notes, projects, planning", icon: Briefcase },
  { value: "study", label: "Study", desc: "Lectures, research, revision", icon: BookOpen },
];

export function ProfileModal(props: ProfileModalProps) {
  if (!props.isOpen) return null;
  return <ProfileModalContent {...props} />;
}

function ProfileModalContent({
  onClose,
  profile,
  onProfileUpdate,
  onSignOut,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "general" | "security">("profile");
  const [searchQuery, setSearchQuery] = useState("");
  const [fullName, setFullName] = useState(profile.fullName);
  const [intent, setIntent] = useState<ProfileIntent>(profile.intent);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isNameChanged = fullName.trim() !== profile.fullName;
  const isIntentChanged = intent !== profile.intent;
  const isDirty = isNameChanged || isIntentChanged;

  async function handleSave() {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const client = createProfileClient({ baseUrl: getApiBaseUrl() });
      const updated = await client.update({
        fullName: fullName.trim(),
        intent,
      });

      onProfileUpdate(updated);

      if (isNameChanged && isIntentChanged) {
        toast.success("Profile updated successfully");
      } else if (isNameChanged) {
        toast.success("Name updated successfully");
      } else if (isIntentChanged) {
        toast.success("Purpose of use updated successfully");
      }
    } catch {
      toast.error("Failed to update profile", "Please try again later.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    try {
      toast.info("Logging out...");
      await onSignOut();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out", "Please try again.");
      setIsLoggingOut(false);
    }
  }

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "N";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6"
    >
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-background md:h-[580px] md:max-w-3xl md:flex-row md:rounded-2xl md:border md:border-border md:bg-card md:shadow-2xl">
        {/* Desktop Sidebar / Left Column (Hidden on mobile) */}
        <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-sidebar/50 p-4 md:flex">
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close settings"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search settings"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-background/50 pl-8 pr-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
            />
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeTab === "profile"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <User className="size-4" />
              Profile & Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeTab === "general"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Sliders className="size-4" />
              General
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
                activeTab === "security"
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Shield className="size-4" />
              Security
            </button>
          </nav>
        </aside>

        {/* Mobile Top Header (Visible only on mobile) */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3.5 md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Back</span>
          </button>
          <span className="text-sm font-semibold">Settings</span>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="h-8 px-3 text-xs"
          >
            {isSaving ? <Loader2 className="size-3 animate-spin" /> : "Save"}
          </Button>
        </header>

        {/* Content Panel / Right Column */}
        <main className="flex flex-1 flex-col overflow-y-auto p-5 md:p-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h2 id="profile-modal-title" className="text-lg font-semibold text-foreground">
                {activeTab === "profile" && "Profile & Account"}
                {activeTab === "general" && "General Settings"}
                {activeTab === "security" && "Security & Sessions"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {activeTab === "profile" && "Manage your identity, use of purpose, and account session."}
                {activeTab === "general" && "Manage preferences and default behaviors for Notter."}
                {activeTab === "security" && "Review session authentication and security parameters."}
              </p>
            </div>
            {/* Desktop Save Button */}
            <div className="hidden md:block">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="h-8 gap-1.5 px-4 text-xs font-medium"
              >
                {isSaving ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>

          {activeTab === "profile" ? (
            <div className="flex flex-col gap-6 pt-5">
              {/* Profile Card Header */}
              <div className="flex items-center gap-4 rounded-xl border border-border bg-card/40 p-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-base border border-primary/20">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{profile.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
                </div>
                <span className="rounded-md bg-muted px-2 py-1 text-[11px] font-mono text-muted-foreground">
                  @{profile.username}
                </span>
              </div>

              {/* Editable Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-full-name" className="text-xs font-medium">
                  Full name
                </Label>
                <Input
                  id="settings-full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10 text-sm"
                />
              </div>

              {/* Read-Only Username */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="settings-username" className="text-xs font-medium text-muted-foreground">
                    Username
                  </Label>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Lock className="size-3" />
                    Cannot be changed
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-muted-foreground select-none">@</span>
                  <Input
                    id="settings-username"
                    value={profile.username}
                    disabled
                    readOnly
                    className="h-10 pl-7 text-sm bg-muted/40 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              {/* Read-Only Email */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="settings-email" className="text-xs font-medium text-muted-foreground">
                  Email address
                </Label>
                <Input
                  id="settings-email"
                  value={profile.email}
                  disabled
                  readOnly
                  className="h-10 text-sm bg-muted/40 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Purpose of Use / Intent */}
              <div className="flex flex-col gap-2.5">
                <Label className="text-xs font-medium">Purpose of use</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {intentOptions.map((opt) => {
                    const isSelected = intent === opt.value;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setIntent(opt.value)}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                            : "border-border bg-card/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex w-full items-center justify-between">
                          <Icon className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground")} />
                          {isSelected ? <Check className="size-3 text-primary" /> : null}
                        </div>
                        <span className="text-xs font-semibold mt-1">{opt.label}</span>
                        <span className="text-[11px] text-muted-foreground leading-snug">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Danger Zone: Log Out */}
              <div className="mt-4 pt-6 border-t border-border flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-destructive uppercase tracking-wider">Account Action</h3>
                    <p className="text-xs text-muted-foreground">Sign out of your active session on this device.</p>
                  </div>

                  {!showLogoutConfirm ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowLogoutConfirm(true)}
                      className="h-8 gap-1.5 text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      <LogOut className="size-3.5" />
                      Log out
                    </Button>
                  ) : null}
                </div>

                {/* Logout Confirmation State */}
                {showLogoutConfirm ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 animate-in fade-in duration-200">
                    <p className="text-xs font-medium text-foreground">
                      Are you sure you want to log out? You will need to sign in again.
                    </p>
                    <div className="flex items-center gap-2 justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoggingOut}
                        onClick={() => setShowLogoutConfirm(false)}
                        className="h-7 text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={isLoggingOut}
                        onClick={handleConfirmLogout}
                        className="h-7 gap-1.5 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isLoggingOut ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-3" />}
                        {isLoggingOut ? "Logging out…" : "Confirm Log out"}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === "general" ? (
            <div className="flex flex-col gap-4 pt-6 text-sm text-muted-foreground">
              <p>General application settings and preferences.</p>
              <div className="rounded-xl border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-xs">Editor font size</p>
                  <p className="text-xs text-muted-foreground">Medium (Default)</p>
                </div>
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
            </div>
          ) : null}

          {activeTab === "security" ? (
            <div className="flex flex-col gap-4 pt-6 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border p-4 flex flex-col gap-1.5">
                <p className="font-medium text-foreground text-xs">Active Session Policy</p>
                <p className="text-xs text-muted-foreground">
                  Your session stays active for up to 7 days of continuous inactivity before requiring re-authentication.
                </p>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
