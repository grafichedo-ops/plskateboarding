"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { nav } from "@/content/copy";
import { XIcon, MenuIcon } from "lucide-react";

export function MobileNav() {
	const [open, setOpen] = React.useState(false);

	return (
		<div className="lg:hidden">
			<Button
				aria-controls="mobile-menu"
				aria-expanded={open}
				aria-label="Apri o chiudi il menu"
				className="lg:hidden"
				onClick={() => setOpen(!open)}
				size="icon"
				variant="outline"
			>
				{open ? (
					<XIcon className="size-[1.125rem]" />
				) : (
					<MenuIcon className="size-[1.125rem]" />
				)}
			</Button>
			{open && (
				<Portal className="top-16" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-[0.97] ease-out data-[slot=open]:animate-in",
							"size-full p-4"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{nav.links.map((link) => (
								<Button
									asChild
									className="justify-start font-display text-lg"
									key={link.href}
									onClick={() => setOpen(false)}
									variant="ghost"
								>
									<Link href={link.href}>{link.label}</Link>
								</Button>
							))}
						</div>
						<div className="mt-12 flex flex-col gap-2">
							<Button
								asChild
								className="btn-press w-full rounded-btn"
								onClick={() => setOpen(false)}
							>
								<Link href="/prenota">{nav.cta}</Link>
							</Button>
						</div>
					</div>
				</Portal>
			)}
		</div>
	);
}
