"use client";

import { RoleProvider } from '@/contexts/RoleContext';

interface RoleProviderWrapperProps {
  children: React.ReactNode;
}

export function RoleProviderWrapper({ children }: RoleProviderWrapperProps) {
  return <RoleProvider>{children}</RoleProvider>;
}