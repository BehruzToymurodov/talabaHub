import type { CategoryOption } from '../../services/api/catalog'
import type { Deal, DealCategory } from '../../types'

export const categoryBannerFallbacks: Record<DealCategory, string> = {
	'Food & Drink': '/banners/fast_food.jpg',
	Telecom: '/banners/products.png',
	'Ride/Delivery': '/banners/delivery.avif',
	Fashion: '/banners/clothes.avif',
	'Books & Education': '/banners/books.webp',
	Fitness: '/banners/products.png',
	Electronics: '/banners/electronics.jpg',
	Travel: '/banners/products.png',
}

export type CategoryTreeItem = {
	id: string
	name: string
	description?: string
	icon?: string
	attachmentUrl?: string
	count: number
	parentId?: string
	parentName?: string
	dealCategory: DealCategory
	children: CategoryTreeItem[]
}

const knownParentNames = new Set<DealCategory>([
	'Food & Drink',
	'Telecom',
	'Ride/Delivery',
	'Fashion',
	'Books & Education',
	'Fitness',
	'Electronics',
	'Travel',
])

function isDealCategory(value?: string): value is DealCategory {
	return Boolean(value && knownParentNames.has(value as DealCategory))
}

export function getCategoryDealCategory(
	category: CategoryOption,
): DealCategory {
	// If category has a parentName, use it (it's a subcategory)
	if (category.parentName) {
		if (isDealCategory(category.parentName)) {
			return category.parentName
		}
		// Parent name is not in known list, need to check if parent is a known category
		// Return the parent name as-is for now
		return category.parentName as DealCategory
	}

	// If category has no parent, check if it's a known category itself
	if (isDealCategory(category.name)) return category.name

	// If it's a top-level category but not in known list, use its name as the deal category
	return category.name as DealCategory
}

export function buildCategoryTree(
	categories: CategoryOption[],
	deals: Deal[],
): CategoryTreeItem[] {
	const countsByCategoryId = deals.reduce<Record<string, number>>(
		(acc, deal) => {
			if (deal.categoryId) {
				acc[deal.categoryId] = (acc[deal.categoryId] ?? 0) + 1
			}
			return acc
		},
		{},
	)

	// First, create parent entries only for top-level categories (no parentId)
	const parentSeed = new Map<string, CategoryTreeItem>()

	categories.forEach(category => {
		// Only create parent entries for categories without a parent
		if (!category.parentId) {
			const dealCategory = getCategoryDealCategory(category)
			parentSeed.set(category.id, {
				id: category.id,
				name: category.name,
				description: category.description,
				icon: category.icon,
				attachmentUrl: category.attachmentUrl,
				count: 0,
				parentId: undefined,
				parentName: undefined,
				dealCategory,
				children: [],
			})
		}
	})

	// Add parents from deals that don't have a category entry
	deals.forEach(deal => {
		if (!parentSeed.has(deal.category)) {
			parentSeed.set(deal.category, {
				id: deal.category,
				name: deal.category,
				attachmentUrl: categoryBannerFallbacks[deal.category],
				count: 0,
				dealCategory: deal.category,
				children: [],
			})
		}
	})

	// Now add child categories to their parents
	categories.forEach(category => {
		// Skip top-level categories (they're already parents)
		if (!category.parentId) return

		// Find the parent
		const parent = parentSeed.get(category.parentId)
		if (!parent) return

		parent.children.push({
			id: category.id,
			name: category.name,
			description: category.description,
			icon: category.icon,
			attachmentUrl: category.attachmentUrl,
			count: countsByCategoryId[category.id] ?? category.activeDealsCount ?? 0,
			parentId: category.parentId,
			parentName: category.parentName,
			dealCategory: parent.dealCategory,
			children: [],
		})
	})

	return Array.from(parentSeed.values())
		.map(parent => {
			const children = parent.children.sort(
				(a, b) => b.count - a.count || a.name.localeCompare(b.name),
			)
			const childCount = children.reduce((sum, child) => sum + child.count, 0)
			const directCount = countsByCategoryId[parent.id] ?? 0
			return {
				...parent,
				attachmentUrl:
					parent.attachmentUrl ?? categoryBannerFallbacks[parent.dealCategory],
				count: Math.max(parent.count, childCount, directCount),
				children,
			}
		})
		.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export function getDealsForCategorySelection(
	deals: Deal[],
	selected: CategoryTreeItem | null,
) {
	if (!selected) return []
	if (selected.parentId) {
		return deals.filter(deal => deal.categoryId === selected.id)
	}
	const childIds = new Set(selected.children.map(child => child.id))
	return deals.filter(
		deal =>
			deal.categoryId === selected.id ||
			(deal.categoryId ? childIds.has(deal.categoryId) : false) ||
			deal.category === selected.dealCategory,
	)
}
