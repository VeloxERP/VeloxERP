import type { LucideIcon } from "lucide-vue-next";
import { Barcode, BookUser, PackageSearch, LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Settings } from "lucide-vue-next";
import NavMain from "@/components/NavMain.vue"
import { ref } from 'vue';

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

export const useNavigation = (): Navigation => {
    return [
        {
            title: "Warenwirtschaft",
            type: NavMain,
            items: [
                {
                    title: 'Adressen',
                    url: '/addresses',
                    icon: BookUser,
                    items: [
                        {
                            title: 'Kunden',
                            url: '/addresses/customers'
                        },
                        {
                            title: 'Lieferanten',
                            url: '/addresses/suppliers'
                        },
                        {
                            title: 'Hersteller',
                            url: '/addresses/manufacturers'
                        },
                        {
                            title: 'Mitarbeiter',
                            url: '/addresses/employees'
                        }
                    ]
                },
                {
                    title: 'Produkte',
                    url: '/products',
                    icon: Package,
                    items: [
                        {
                            title: 'Alle Produkte',
                            url: '/products'
                        },
                        {
                            title: 'Eigenschaften',
                            url: '/products/properties'
                        },
                        {
                            title: 'Kategorien',
                            url: '/products/categories'
                        }
                    ],
                },
                {
                    title: 'Logistik',
                    url: '/logistics',
                    icon: PackageSearch,
                    items: [
                        {
                            title: 'Bestellungen',
                            url: '/orders'
                        },
                        {
                            title: 'Lagerbestand',
                            url: '/inventory'
                        },
                        {
                            title: 'Lieferungen',
                            url: '/shipments'
                        },
                    ],
                }
            ]
        },
        {
            title: "Administration",
            type: NavMain,
            items: [
                {
                    title: 'Einstellungen',
                    url: '/settings',
                    icon: Settings,
                    items: [
                        {
                            title: 'Allgemein',
                            url: '/settings/general'
                        },
                        {
                            title: 'Benutzer',
                            url: '/settings/users'
                        },
                        {
                            title: 'Rollen',
                            url: '/settings/roles'
                        }
                    ]
                }
            ],
            show: () => {
                return true;
            }
        }
    ]
}
