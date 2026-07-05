"use client";

import { useMemo, useState, useTransition } from "react";
import { Search, Trash2, UserPlus } from "lucide-react";

import {
  AdminPanel,
  AdminPrimaryButton,
  adminInputClass,
  adminSelectClass,
  adminTable,
} from "@/components/admin/admin-ui";
import { USER_ROLE_LABELS, USER_ROLES } from "@/lib/auth/permissions";
import type { UserRole } from "@/types/auth";
import {
  deleteManagedUserAction,
  inviteManagedUserAction,
  updateManagedUserAction,
} from "@/lib/users/managed-users-actions";
import { managedUserRoleLabel, type ManagedUser } from "@/lib/users/managed-users-types";

type ManagedUsersPanelProps = {
  initialUsers: ManagedUser[];
  initialError: string | null;
  currentUserId: string;
};

type StatusFilter = "all" | "active" | "inactive";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("sv-SE", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ManagedUsersPanel({
  initialUsers,
  initialError,
  currentUserId,
}: ManagedUsersPanelProps) {
  const [users, setUsers] = useState(initialUsers);
  const [fetchError, setFetchError] = useState(initialError);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("editor");
  const [nameDrafts, setNameDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initialUsers.map((user) => [user.id, user.full_name])),
  );
  const [message, setMessage] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !needle ||
        user.full_name.toLowerCase().includes(needle) ||
        (user.email ?? "").toLowerCase().includes(needle);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.is_active) ||
        (statusFilter === "inactive" && !user.is_active);
      return matchesQuery && matchesStatus;
    });
  }, [users, query, statusFilter]);

  function refreshUsers(nextUsers: ManagedUser[]) {
    setUsers(nextUsers);
    setNameDrafts((current) => {
      const next = { ...current };
      for (const user of nextUsers) {
        if (next[user.id] === undefined) {
          next[user.id] = user.full_name;
        }
      }
      return next;
    });
  }

  function inviteUser() {
    setMessage(null);
    setFetchError(null);
    startTransition(async () => {
      const result = await inviteManagedUserAction({
        email: inviteEmail,
        full_name: inviteName,
        role: inviteRole,
      });

      if (!result.ok) {
        setFetchError(result.error);
        return;
      }

      setInviteEmail("");
      setInviteName("");
      setInviteRole("editor");
      setMessage(
        result.existing
          ? "Användaren fanns redan — profilen är uppdaterad."
          : "Inbjudan skickad. Användaren får ett mejl med länk för att aktivera kontot.",
      );

      const response = await fetch("/api/admin/managed-users");
      if (response.ok) {
        const data = (await response.json()) as { users: ManagedUser[] };
        refreshUsers(data.users);
      }
    });
  }

  function saveDisplayName(user: ManagedUser) {
    const draft = nameDrafts[user.id]?.trim() ?? "";
    if (!draft || draft === user.full_name) return;

    setSavingUserId(user.id);
    setMessage(null);
    startTransition(async () => {
      const result = await updateManagedUserAction(user.id, {
        full_name: draft,
      });
      setSavingUserId(null);
      if (!result.ok) {
        setNameDrafts((current) => ({ ...current, [user.id]: user.full_name }));
        setFetchError(result.error);
        return;
      }

      setUsers((current) =>
        current.map((row) =>
          row.id === user.id ? { ...row, full_name: draft } : row,
        ),
      );
      setMessage("Visningsnamn sparat.");
    });
  }

  function saveRole(user: ManagedUser, role: UserRole) {
    if (user.role === role) return;

    setSavingUserId(user.id);
    setMessage(null);
    startTransition(async () => {
      const result = await updateManagedUserAction(user.id, { role });
      setSavingUserId(null);
      if (!result.ok) {
        setFetchError(result.error);
        return;
      }

      setUsers((current) =>
        current.map((row) => (row.id === user.id ? { ...row, role } : row)),
      );
      setMessage("Roll uppdaterad.");
    });
  }

  function saveActiveStatus(user: ManagedUser, isActive: boolean) {
    if (user.is_active === isActive) return;

    setSavingUserId(user.id);
    setMessage(null);
    startTransition(async () => {
      const result = await updateManagedUserAction(user.id, {
        is_active: isActive,
      });
      setSavingUserId(null);
      if (!result.ok) {
        setFetchError(result.error);
        return;
      }

      setUsers((current) =>
        current.map((row) =>
          row.id === user.id ? { ...row, is_active: isActive } : row,
        ),
      );
      setMessage(
        isActive ? "Användaren är nu aktiv." : "Användaren är inaktiverad.",
      );
    });
  }

  function removeUser(user: ManagedUser) {
    if (
      !window.confirm(
        `Ta bort ${user.full_name} permanent? Detta går inte att ångra.`,
      )
    ) {
      return;
    }

    setSavingUserId(user.id);
    setMessage(null);
    startTransition(async () => {
      const result = await deleteManagedUserAction(user.id);
      setSavingUserId(null);
      if (!result.ok) {
        setFetchError(result.error);
        return;
      }

      setUsers((current) => current.filter((row) => row.id !== user.id));
      setMessage("Användaren borttagen.");
    });
  }

  return (
    <div className="w-full min-w-0 space-y-4">
      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {message}
        </div>
      ) : null}

      <AdminPanel
        icon={UserPlus}
        title="Bjud in användare"
        description="Skicka inbjudan via e-post och välj kontotyp."
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            autoComplete="email"
            placeholder="E-post"
            className={adminInputClass}
          />
          <input
            type="text"
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
            autoComplete="name"
            placeholder="Visningsnamn"
            className={adminInputClass}
          />
          <select
            value={inviteRole}
            onChange={(event) => setInviteRole(event.target.value as UserRole)}
            className={adminSelectClass}
          >
            {USER_ROLES.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          <AdminPrimaryButton
            type="button"
            disabled={pending || !inviteEmail.trim() || !inviteName.trim()}
            onClick={inviteUser}
          >
            Skicka inbjudan
          </AdminPrimaryButton>
        </div>
      </AdminPanel>

      <AdminPanel
        icon={Search}
        title="Användare"
        description={`${filteredUsers.length} konton`}
      >
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
          <div className="relative min-w-[14rem] flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sök namn eller e-post"
              className={`${adminInputClass} py-2 pr-3 pl-8 text-sm`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className={`${adminSelectClass} w-full sm:w-40`}
          >
            <option value="all">Alla</option>
            <option value="active">Aktiva</option>
            <option value="inactive">Inaktiva</option>
          </select>
        </div>

        {fetchError && filteredUsers.length === 0 ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {fetchError}
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className={adminTable.table}>
              <thead className={adminTable.thead}>
                <tr>
                  <th className={adminTable.th}>Visningsnamn</th>
                  <th className={`hidden ${adminTable.th} md:table-cell`}>
                    E-post
                  </th>
                  <th className={`hidden ${adminTable.th} lg:table-cell`}>
                    Senast inloggad
                  </th>
                  <th className={adminTable.th}>Roll</th>
                  <th className={adminTable.th}>Status</th>
                  <th className={`${adminTable.th} text-right`}>
                    <span className="sr-only">Åtgärder</span>
                  </th>
                </tr>
              </thead>
              <tbody className={adminTable.tbody}>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`${adminTable.tr} ${!user.is_active ? "opacity-60" : ""}`}
                  >
                    <td className={adminTable.td}>
                      <input
                        type="text"
                        value={nameDrafts[user.id] ?? user.full_name}
                        onChange={(event) =>
                          setNameDrafts((current) => ({
                            ...current,
                            [user.id]: event.target.value,
                          }))
                        }
                        disabled={savingUserId === user.id}
                        onBlur={() => saveDisplayName(user)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.currentTarget.blur();
                          }
                        }}
                        className={`${adminInputClass} h-8 w-full min-w-[10rem] text-sm`}
                      />
                      <p className="mt-1 truncate text-xs text-neutral-500 md:hidden">
                        {user.email ?? "E-post saknas"}
                      </p>
                    </td>
                    <td className={`hidden ${adminTable.td} md:table-cell`}>
                      <span className="block max-w-[16rem] truncate">
                        {user.email ?? "—"}
                      </span>
                    </td>
                    <td
                      className={`hidden ${adminTable.td} whitespace-nowrap lg:table-cell`}
                    >
                      {formatDate(user.last_sign_in_at)}
                    </td>
                    <td className={adminTable.td}>
                      <select
                        value={user.role}
                        disabled={
                          savingUserId === user.id || user.id === currentUserId
                        }
                        onChange={(event) =>
                          saveRole(user, event.target.value as UserRole)
                        }
                        className={`${adminSelectClass} h-8 w-full min-w-[9rem] text-sm`}
                      >
                        {USER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {managedUserRoleLabel(role)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className={adminTable.td}>
                      <select
                        value={user.is_active ? "active" : "inactive"}
                        disabled={
                          savingUserId === user.id || user.id === currentUserId
                        }
                        onChange={(event) =>
                          saveActiveStatus(user, event.target.value === "active")
                        }
                        className={`${adminSelectClass} h-8 w-full min-w-[8.5rem] text-sm`}
                      >
                        <option value="active">Aktiv</option>
                        <option value="inactive">Inaktiv</option>
                      </select>
                    </td>
                    <td className={`${adminTable.td} text-right`}>
                      <button
                        type="button"
                        disabled={
                          user.id === currentUserId || savingUserId === user.id
                        }
                        title={
                          user.id === currentUserId
                            ? "Du kan inte ta bort dig själv"
                            : "Ta bort användare"
                        }
                        onClick={() => removeUser(user)}
                        className="inline-flex size-8 items-center justify-center rounded-md border border-neutral-200 text-neutral-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 className="size-4" aria-hidden />
                        <span className="sr-only">Ta bort {user.full_name}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!fetchError && filteredUsers.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Inga användare matchar filtret.
          </p>
        ) : null}
      </AdminPanel>
    </div>
  );
}
