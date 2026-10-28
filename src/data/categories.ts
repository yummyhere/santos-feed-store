import { CategoryInfo, FeedCategoryId } from '../types/store';
import { STORE_IMAGES } from './images';

export const FEED_CATEGORIES: CategoryInfo[] = [
  {
    id: FeedCategoryId.Livestock,
    name: 'Livestock Feed',
    shortName: 'Livestock',
    description: 'Pelleted rations, alfalfa cubes, and rolled grains for cattle, goats, sheep, and horses.',
    examples: 'Alfalfa pellets · All-stock rations · Rolled barley & corn',
    image: STORE_IMAGES.livestockFeedPellets,
    imageAlt: 'Open brown kraft sack of pelleted livestock feed next to rolled barley in a metal scoop',
  },
  {
    id: FeedCategoryId.Poultry,
    name: 'Poultry Feed',
    shortName: 'Poultry',
    description: 'Layer crumbles, pellets, chick starter, and scratch grains for backyard and ranch flocks.',
    examples: 'Layer crumbles · Three-grain scratch · Starter & grower',
    image: STORE_IMAGES.poultryLayerGrain,
    imageAlt: 'Laying hens pecking grain and layer crumbles from a galvanized feeder on dry straw',
  },
  {
    id: FeedCategoryId.Pigeon,
    name: 'Pigeon Feed',
    shortName: 'Pigeon',
    description: 'Clean whole-seed mixes, conditioning blends, peas, safflower, and mineral grit for lofts.',
    examples: 'Loft conditioning mix · Breeder grain · Mineral grit',
    image: STORE_IMAGES.pigeonGrainMix,
    imageAlt: 'Burlap sack of whole pigeon grain mix with peas, safflower, corn, and milo beside a loft perch',
  },
  {
    id: FeedCategoryId.Supplies,
    name: 'Grain & Feed Supplies',
    shortName: 'Grain & Supplies',
    description: 'Single whole grains, salt and trace mineral blocks, galvanized scoops, and utility feeders.',
    examples: 'Whole oats · Mineral salt blocks · Scoops & buckets',
    image: STORE_IMAGES.farmGrainSupplies,
    imageAlt: 'Galvanized feed buckets, red trace mineral block, metal scoops, and rolled oats in a wooden bin',
  },
];

export function getCategoryById(id: FeedCategoryId): CategoryInfo | undefined {
  return FEED_CATEGORIES.find((cat) => cat.id === id);
}
