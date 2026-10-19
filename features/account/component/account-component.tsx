"use client";

import { useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  KeyRound,
  LogOut,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getClerkErrorMessage } from "@/lib/clerk/error";
import { formatMediumDate } from "@/lib/date";
import { showError, showSuccess } from "@/lib/toast/toast.lib";
import { cn } from "@/lib/utils";
import { getUserDisplayName, getUserInitials } from "@/lib/user/profile";
import AccountProfileForm from "../form/account-profile.form";
import type { AccountProfileFormData } from "../types/account.types";

export default function AccountComponent() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const defaultValues = useMemo<AccountProfileFormData>(() => {
    const profileMetadata = getAccountProfileMetadata(user?.unsafeMetadata);

    return {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      ...profileMetadata,
    };
  }, [user?.firstName, user?.lastName, user?.unsafeMetadata]);

  if (!isLoaded) {
    return <AccountSkeleton />;
  }

  if (!isSignedIn || !user) {
    return null;
  }

  const email = user.primaryEmailAddress?.emailAddress;
  const displayName = getUserDisplayName({
    email,
    name: user.fullName,
  });
  const initials = getUserInitials({
    email,
    name: user.fullName,
  });

  const handleSaveProfile = async (data: AccountProfileFormData) => {
    setIsSavingProfile(true);

    try {
      const existingUnsafeMetadata = isRecord(user.unsafeMetadata)
        ? user.unsafeMetadata
        : {};
      const existingProfileMetadata = isRecord(existingUnsafeMetadata.profile)
        ? existingUnsafeMetadata.profile
        : {};

      await user.update({
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        unsafeMetadata: {
          ...existingUnsafeMetadata,
          profile: {
            ...existingProfileMetadata,
            ...getAccountProfileMetadataUpdate(data),
          },
        },
      });
      await user.reload();
      showSuccess("Account profile updated");
    } catch (error) {
      showError(
        getClerkErrorMessage(error, "Something went wrong", {
          includeNativeError: true,
        }),
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);

    try {
      await user.setProfileImage({ file });
      await user.reload();
      showSuccess("Profile photo updated");
    } catch (error) {
      showError(
        getClerkErrorMessage(error, "Something went wrong", {
          includeNativeError: true,
        }),
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto flex w-full md:max-w-300 flex-col gap-6 px-4 py-4 md:px-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">Account</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Profile settings
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <Avatar size="lg">
                    <AvatarImage src={user.imageUrl} alt={displayName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{displayName}</p>
                    {email ? (
                      <p className="truncate text-sm text-muted-foreground">
                        {email}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploadingImage ? "Uploading..." : "Change photo"}
                  </Button>
                </div>
              </div>

              <AccountProfileForm
                defaultValues={defaultValues}
                isSaving={isSavingProfile}
                onSave={handleSaveProfile}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <AccountStatusItem
                icon={Mail}
                label="Primary email"
                value={email || "Not set"}
              />
              <AccountStatusItem
                icon={KeyRound}
                label="Password"
                value={user.passwordEnabled ? "Enabled" : "Not enabled"}
              />
              <AccountStatusItem
                icon={ShieldCheck}
                label="Two-factor auth"
                value={user.twoFactorEnabled ? "Enabled" : "Not enabled"}
              />
              <AccountStatusItem
                icon={CalendarDays}
                label="Last sign in"
                value={formatMediumDate(user.lastSignInAt)}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{displayName}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <SummaryRow
                  label="Created"
                  value={formatMediumDate(user.createdAt)}
                />
                <SummaryRow
                  label="Updated"
                  value={formatMediumDate(user.updatedAt)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign out of this browser session when you are done working.
              </p>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => void signOut({ redirectUrl: "/sign-in" })}
              >
                <LogOut />
                Sign out
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type AccountProfileMetadata = Pick<
  AccountProfileFormData,
  "phoneNumber" | "location" | "linkedinUrl" | "githubUrl" | "portfolioUrl"
>;

function getAccountProfileMetadata(metadata: unknown): AccountProfileMetadata {
  const profile = isRecord(metadata) && isRecord(metadata.profile)
    ? metadata.profile
    : {};

  return {
    phoneNumber: getStringMetadataValue(profile.phoneNumber),
    location: getStringMetadataValue(profile.location),
    linkedinUrl: getStringMetadataValue(profile.linkedinUrl),
    githubUrl: getStringMetadataValue(profile.githubUrl),
    portfolioUrl: getStringMetadataValue(profile.portfolioUrl),
  };
}

function getAccountProfileMetadataUpdate(
  data: AccountProfileFormData,
): AccountProfileMetadata {
  return {
    phoneNumber: data.phoneNumber,
    location: data.location,
    linkedinUrl: data.linkedinUrl,
    githubUrl: data.githubUrl,
    portfolioUrl: data.portfolioUrl,
  };
}

function getStringMetadataValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function AccountStatusItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-4 md:px-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-56" />
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full rounded-lg" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
        <Skeleton className={cn("h-64 rounded-lg")} />
      </div>
    </div>
  );
}
