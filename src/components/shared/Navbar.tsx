import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router";
import { AccessLevel } from "./ThemeWrapper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import useRole from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useLogRoleChange } from "@/hooks/useLogRoleChange"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentRole, setCurrentRole } = useRole();
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();

  const possibleRoles = user?.roles
    .filter((role) => role.active)
    .map((role) => role.roleName.toLowerCase());

  const logRoleChangeMutation = useLogRoleChange()

  const handleRoleChange = (value: string) => {
    const role = value as AccessLevel;
  
    if (role) {
      logRoleChangeMutation.mutate({
        previousRole: currentRole,
        newRole: role,
      });
    }
  
    setCurrentRole(role);
  };
  


  const handleLogout = async () => {
    localStorage.removeItem("token");

    setCurrentRole(null);

    localStorage.removeItem("user-role");
    queryClient.setQueryData(["currentUser"], null);
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">
                Dietetycy XXI wieku
              </span>
            </Link>
          </div>

          {currentRole && (
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center text-gray-600 hover:text-green-600"
                  >
                    <User className="h-5 w-5 mr-1" />
                    <span className="mr-1">Profile</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div className="flex flex-col w-full">
                      <span className="text-sm font-medium mb-1">Role</span>
                      <Select
                        value={currentRole}
                        onValueChange={handleRoleChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {possibleRoles?.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {currentRole && (
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && currentRole && (
        <div className="sm:hidden">
          <div className="pt-4 pb-3 border-t border-green-100">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <User className="h-10 w-10 text-gray-400" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  User Profile
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <div className="px-4 py-2">
                <p className="text-sm font-medium mb-1">Role</p>
                <Select value={currentRole} onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {possibleRoles?.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-base font-medium text-red-500 hover:bg-green-100"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}