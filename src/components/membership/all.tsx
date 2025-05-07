'use client';

import { UserCard } from "./user-card";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandItem, CommandList, CommandEmpty } from "@/components/ui/command";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function AllUsers({ users: initialUsers, currentUserId }: { users: any[]; currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);

  // Callback to update a user's applicationStatus
  const updateUserStatus = (userId: string, newStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, applicationStatus: newStatus } : user
      )
    );
  };

  // Combined status options in Arabic
  const statusOptions = [
    { value: "ALL", label: "الكل" },
    { value: "COMPLETED", label: "مكتمل" },
    { value: "INCOMPLETE", label: "ناقص" },
    { value: "APPROVED", label: "مقبول" },
    { value: "REJECTED", label: "مرفوض" },
    { value: "NO_RESPONSE", label: "بدون رد" },
  ];

  // Role options in Arabic
  const roleLabel = (role: string) => {
    if (role === "ADMIN") return "مشرف";
    if (role === "USER") return "عضو";
    return role;
  };
  const allRoles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(users.map(u => u.role).filter(Boolean)));
    return ["ALL", ...uniqueRoles];
  }, [users]);
  const roleOptions = allRoles.map(role => ({ value: role, label: role === "ALL" ? "الكل" : roleLabel(role) }));

  // State for filters
  const [status, setStatus] = useState<string>("ALL");
  const [role, setRole] = useState<string>("ALL");
  const [isOpen, setIsOpen] = useState(false);
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  const [searchName, setSearchName] = useState("");

  // Filter users based on selected status, role, and search term
  const filteredUsers = users.filter((user) => {
    // Status filter
    let statusMatch = true;
    switch (status) {
      case "COMPLETED":
        statusMatch = user.onboardingStatus === "COMPLETED";
        break;
      case "INCOMPLETE":
        statusMatch = user.onboardingStatus === "PENDING" || user.onboardingStatus === "IN_PROGRESS";
        break;
      case "APPROVED":
        statusMatch = user.applicationStatus === "APPROVED";
        break;
      case "REJECTED":
        statusMatch = user.applicationStatus === "REJECTED";
        break;
      case "NO_RESPONSE":
        statusMatch = !user.applicationStatus || user.applicationStatus === "PENDING";
        break;
      default:
        statusMatch = true;
    }
    // Role filter
    const roleMatch = role === "ALL" || user.role === role;
    // Name search filter
    const nameMatch = user.name && user.name.toLowerCase().includes(searchName.toLowerCase());
    return statusMatch && roleMatch && (searchName.trim() === "" || nameMatch);
  });

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex gap-x-4 mb-4 items-end py-4 border-b border-dashed">
        <Input
          type="text"
          className="border rounded px-2 py-1 w-52 h-9"
          placeholder="ابحث بالاسم..."
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        {/* Status Filter */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 ">
              <PlusCircledIcon className="mr-2 size-4" />
               الطلب
              {/* <span className="font-bold">{statusOptions.find(o => o.value === status)?.label}</span> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[103px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                {statusOptions.map((option, index) => (
                  <>
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setStatus(option.value);
                        setIsOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </CommandItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* Role Filter */}
        <Popover open={isRoleOpen} onOpenChange={setIsRoleOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircledIcon className="mr-2 size-4" />
              الدور
              {/* <span className="font-bold">{roleOptions.find(o => o.value === role)?.label}</span> */}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[93px]" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>لا توجد نتائج.</CommandEmpty>
                {roleOptions.map((option, index) => (
                  <>
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        setRole(option.value);
                        setIsRoleOpen(false);
                      }}
                    >
                      <span>{option.label}</span>
                    </CommandItem>
                    {index === 0 && <DropdownMenuSeparator />}
                  </>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      {/* User List */}
      {filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] rounded-lg border border-dashed mt-8 p-8 text-center">
          <h2 className="text-2xl font-semibold">لا يوجد مستخدمون</h2>
          <p className="text-muted-foreground max-w-[500px] mt-2">
            لا يوجد مستخدمون مسجلون بعد.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isCurrentUser={user.id === currentUserId}
              onStatusChange={updateUserStatus}
            />
          ))}
        </div>
      )}
    </>
  );
} 