import type {LucideIcon} from "lucide-vue-next";
import {Barcode, BookUser, PackageSearch} from "lucide-vue-next";
import NavMain from "@/components/NavMain.vue"

export const useNavigation = (): Navigation => {
    return [
        {
            title: "Warenwirtschaft",
            type: NavMain,
            items: [
                {
                    title: 'Adressen',
                    url: '#',
                    icon: BookUser,
                    isActive: true,
                    items: [
                        {
                            title: 'Kunden',
                            url: '#'
                        },
                        {
                            title: 'Lieferanten',
                            url: '#'
                        },
                        {
                            title: 'Hersteller',
                            url: '#'
                        },
                        {
                            title: 'Mitarbeiter',
                            url: '#'
                        }
                    ]
                },
                {
                    title: 'Produkte',
                    url: '#',
                    icon: Barcode,
                    items: [
                        {
                            title: 'Eigenschaften',
                            url: '#',
                        },
                        {
                            title: 'Starred',
                            url: '#',
                        },
                        {
                            title: 'Settings',
                            url: '#',
                        },
                    ],
                },
                {
                    title: 'Logistik',
                    url: '#',
                    icon: PackageSearch,
                    items: [
                        {
                            title: 'Genesis',
                            url: '#',
                        },
                        {
                            title: 'Explorer',
                            url: '#',
                        },
                        {
                            title: 'Quantum',
                            url: '#',
                        },
                    ],
                }
            ]
        },
        {
            title: "Administration",
            type: NavMain,
            items: [],
            show: () => {
                return true;
            }
        }
    ]
}

enum NavigationSectionType {
    LINKS,
    ITEMS
}

type Navigation = NavigationSection[];

type NavigationSection = {
    title: string
    type: Component
    items: MainSectionItem[],
    show?: () => boolean
}

type MainSectionItem = {
    title: string,
    url: string,
    icon: LucideIcon,
    isActive?: boolean,
    items?: SectionItem[]
}

type SectionItem = {
    title: string,
    url: string,
}
