'use client'

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, Breadcrumb as ShadcnBreadcrumb } from "@/components/ui/breadcrumb"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

type SegmentEntry = {
  id: string,
  display: string,
  href: string,
  display_if_last: string
}

export type SegmentMapping = Record<string, SegmentEntry>

const segment_mapping: SegmentMapping = {
  applications: {
    id: "applications",
    display: "Candidatures",
    href: "/applications",
    display_if_last: 'Candidature'
  }
}


export default function Breadcrumb() {
  const pathname = usePathname().slice(1)
  const last_display = "Candidature"

  const segments = []

  for (const segment of pathname.split('/').slice(0, -1)) {
    console.log(segment)
    if (segment in segment_mapping) {
      segments.push(segment_mapping[segment])
    }
  }

  if (segments.length == 0) {
    return;
  }

  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList>
        {
          segments.map(segment => {
            return (
              <Fragment key={segment.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={segment.href}>{segment.display}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            )
          })
        }
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{last_display}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  )
}