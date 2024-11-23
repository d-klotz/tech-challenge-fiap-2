/**
 * Interface representing a crop option with its characteristics.
 * All monetary values are in arbitrary currency units.
 */
export interface CropOption {
  name: string;           // Name of the crop
  space_required: number; // Space required in acres (can be fractional)
  cost: number;          // Cost per unit to plant and maintain
  yield: number;         // Expected yield per unit in monetary value
  growth_time: number;   // Time to harvest in days
}

/**
 * Available crop options with their respective characteristics.
 * Each crop has different space requirements, costs, yields, and growth times,
 * allowing for diverse optimization scenarios.
 */
export const cropOptions: CropOption[] = [
  { name: "Milho", space_required: 1, cost: 150, yield: 400, growth_time: 120 },
  { name: "Soja", space_required: 1, cost: 100, yield: 300, growth_time: 120 },
  { name: "Arroz", space_required: 1, cost: 180, yield: 500, growth_time: 150 },
  { name: "Batata", space_required: 0.5, cost: 80, yield: 200, growth_time: 90 },
  { name: "Tomate", space_required: 0.5, cost: 100, yield: 300, growth_time: 90 },
  { name: "Cenoura", space_required: 0.25, cost: 60, yield: 150, growth_time: 60 },
  { name: "Pepino", space_required: 0.25, cost: 80, yield: 200, growth_time: 60 },
  { name: "Pimentão", space_required: 0.5, cost: 120, yield: 250, growth_time: 90 },
  { name: "Cebola", space_required: 0.25, cost: 60, yield: 150, growth_time: 60 },
  { name: "Trigo", space_required: 1, cost: 120, yield: 250, growth_time: 90 },
];

/**
 * Represents a potential solution in the farm allocation problem.
 * Each allocation consists of two different crops and their respective allocated acres.
 */
class FarmAllocation {
  constructor(
    public crop1_index: number,    // Index of first crop in cropOptions array
    public crop2_index: number,    // Index of second crop in cropOptions array
    public crop1_acres: number,    // Acres allocated to first crop
    public crop2_acres: number     // Acres allocated to second crop
  ) {}

  /**
   * Checks if the allocation is valid by ensuring the two crops are different.
   */
  isValid(): boolean {
    return this.crop1_index !== this.crop2_index;
  }

  /**
   * Creates a normalized key for the allocation to ensure consistent comparison.
   * Sorts the crop indices to treat [crop1, crop2] and [crop2, crop1] as equivalent.
   */
  getNormalizedKey(): [[number, number], [number, number]] {
    const crops = [
      [this.crop1_index, this.crop1_acres],
      [this.crop2_index, this.crop2_acres],
    ].sort((a, b) => a[0] - b[0]);
    return [crops[0] as [number, number], crops[1] as [number, number]];
  }
}

/**
 * Farm Plot Genetic Algorithm (GA) implementation for optimizing crop allocation.
 * Uses evolutionary principles to find optimal combinations of crops and their allocated space
 * to maximize yearly profit while respecting constraints.
 */
export class FarmPlotGA {
  private population_size: number;   // Number of solutions in each generation
  private mutation_rate: number;     // Probability of mutation occurring
  private total_acres: number;       // Total available farming area
  private max_growth_time: number;   // Maximum allowed growth time for crops
  private days_per_year: number;     // Days in a year for harvest calculations

  constructor(population_size: number = 100, mutation_rate: number = 0.2) {
    this.population_size = population_size;
    this.mutation_rate = mutation_rate;
    this.total_acres = 10;           // Fixed farm size of 10 acres
    this.max_growth_time = 260;      // Maximum 260 days growth time
    this.days_per_year = 365;
  }

  /**
   * Generates a random pair of different crop indices.
   * Used in creating initial population and mutations.
   */
  private generateValidCropPair(): [number, number] {
    const crop1_index = Math.floor(Math.random() * cropOptions.length);
    let crop2_index;
    do {
      crop2_index = Math.floor(Math.random() * cropOptions.length);
    } while (crop2_index === crop1_index);
    return [crop1_index, crop2_index];
  }

  /**
   * Creates the initial population of random valid farm allocations.
   * Ensures all allocations respect basic constraints like total acreage
   * and using different crops.
   */
  private generateInitialPopulation(): FarmAllocation[] {
    const population: FarmAllocation[] = [];
    while (population.length < this.population_size) {
      const [crop1_index, crop2_index] = this.generateValidCropPair();
      const crop1_space = cropOptions[crop1_index].space_required;
      const crop2_space = cropOptions[crop2_index].space_required;
      
      // Calculate valid acre ranges considering space requirements
      const max_acres_crop1 = Math.min(9, this.total_acres - crop2_space);
      const min_acres_crop1 = Math.max(1, crop1_space);
      const crop1_acres = Math.floor(Math.random() * (max_acres_crop1 - min_acres_crop1 + 1)) + min_acres_crop1;
      const crop2_acres = this.total_acres - crop1_acres;
      
      const allocation = new FarmAllocation(crop1_index, crop2_index, crop1_acres, crop2_acres);
      if (allocation.isValid()) {
        population.push(allocation);
      }
    }
    return population;
  }

  /**
   * Calculates the fitness (yearly profit) of a given farm allocation.
   * Considers multiple factors:
   * - Number of harvests possible per year based on growth time
   * - Revenue from crop yields
   * - Costs of planting and maintaining crops
   * - Bonus for using crops with different space requirements (diversity bonus)
   */
  private calculateFitness(allocation: FarmAllocation): number {
    if (!allocation.isValid()) {
      return 0;
    }

    const crop1 = cropOptions[allocation.crop1_index];
    const crop2 = cropOptions[allocation.crop2_index];

    // Check constraints
    if (
      allocation.crop1_acres + allocation.crop2_acres !== this.total_acres ||
      crop1.growth_time > this.max_growth_time ||
      crop2.growth_time > this.max_growth_time
    ) {
      return 0;
    }

    // Calculate harvests per year for each crop
    const harvests_per_year_crop1 = this.days_per_year / crop1.growth_time;
    const harvests_per_year_crop2 = this.days_per_year / crop2.growth_time;

    // Calculate units of each crop based on space requirements
    const units_crop1 = Math.floor(allocation.crop1_acres / crop1.space_required);
    const units_crop2 = Math.floor(allocation.crop2_acres / crop2.space_required);

    // Calculate yearly revenue
    const revenue_crop1 = units_crop1 * crop1.yield * harvests_per_year_crop1;
    const revenue_crop2 = units_crop2 * crop2.yield * harvests_per_year_crop2;

    // Calculate yearly costs
    const costs_crop1 = units_crop1 * crop1.cost * harvests_per_year_crop1;
    const costs_crop2 = units_crop2 * crop2.cost * harvests_per_year_crop2;

    let total_profit = revenue_crop1 + revenue_crop2 - costs_crop1 - costs_crop2;

    // Apply diversity bonus for using crops with different space requirements
    if (crop1.space_required !== crop2.space_required) {
      total_profit *= 1.1; // 10% bonus for crop diversity
    }

    return Math.max(0, total_profit);
  }

  /**
   * Implements tournament selection for choosing parents.
   * Randomly selects a subset of solutions and returns the one with highest fitness.
   * This helps maintain diversity while still favoring better solutions.
   */
  private tournamentSelection(population: FarmAllocation[], tournament_size: number = 5): FarmAllocation {
    const tournament = Array.from({ length: tournament_size }, () => 
      population[Math.floor(Math.random() * population.length)]
    );
    const tournament_fitness = tournament.map(ind => this.calculateFitness(ind));
    return tournament[tournament_fitness.indexOf(Math.max(...tournament_fitness))];
  }

  /**
   * Creates a new solution by combining aspects of two parent solutions.
   * Uses two crossover strategies:
   * 1. Inherit crop choices from one parent and acreage from another
   * 2. Mix crop choices and calculate new acreage based on parents
   */
  private crossover(parent1: FarmAllocation, parent2: FarmAllocation): FarmAllocation {
    if (Math.random() < 0.5) {
      // Strategy 1: Keep crops from parent1, take acres from parent2
      return new FarmAllocation(
        parent1.crop1_index,
        parent1.crop2_index,
        parent2.crop1_acres,
        parent2.crop2_acres
      );
    } else {
      // Strategy 2: Mix crops and calculate new acreage
      const crop1_index = Math.random() < 0.5 ? parent1.crop1_index : parent2.crop1_index;
      const other_crops = Array.from({ length: cropOptions.length }, (_, i) => i)
        .filter(i => i !== crop1_index);
      const crop2_index = other_crops[Math.floor(Math.random() * other_crops.length)];
      
      // Average parents' acreage with small random variation
      const base_acres = Math.floor((parent1.crop1_acres + parent2.crop1_acres) / 2);
      const variation = Math.floor(Math.random() * 3) - 1;
      const crop1_acres = Math.max(1, Math.min(9, base_acres + variation));
      const crop2_acres = this.total_acres - crop1_acres;
      
      return new FarmAllocation(crop1_index, crop2_index, crop1_acres, crop2_acres);
    }
  }

  /**
   * Applies random mutations to a solution based on mutation rate.
   * Three types of mutations:
   * 1. Change first crop
   * 2. Change second crop
   * 3. Adjust acreage allocation
   */
  private mutate(allocation: FarmAllocation): FarmAllocation {
    if (Math.random() < this.mutation_rate) {
      const mutation_type = Math.floor(Math.random() * 3);
      
      if (mutation_type === 0) {
        // Change first crop
        const available_crops = Array.from({ length: cropOptions.length }, (_, i) => i)
          .filter(i => i !== allocation.crop2_index);
        allocation.crop1_index = available_crops[Math.floor(Math.random() * available_crops.length)];
      } else if (mutation_type === 1) {
        // Change second crop
        const available_crops = Array.from({ length: cropOptions.length }, (_, i) => i)
          .filter(i => i !== allocation.crop1_index);
        allocation.crop2_index = available_crops[Math.floor(Math.random() * available_crops.length)];
      } else {
        // Adjust acreage
        const shift = Math.floor(Math.random() * 5) - 2; // Random shift between -2 and +2
        allocation.crop1_acres = Math.max(1, Math.min(9, allocation.crop1_acres + shift));
        allocation.crop2_acres = this.total_acres - allocation.crop1_acres;
      }
    }
    return allocation;
  }

  /**
   * Runs the genetic algorithm for the specified number of generations.
   * Implements elitism by keeping the best solution across generations.
   * Returns the top 10 solutions found along with their fitness scores.
   */
  public run(generations: number = 150): { solutions: FarmAllocation[], fitnessScores: number[] } {
    let population = this.generateInitialPopulation();
    let best_ever: FarmAllocation | null = null;
    let best_ever_fitness = Number.NEGATIVE_INFINITY;

    for (let generation = 0; generation < generations; generation++) {
      const fitness_scores = population.map(ind => this.calculateFitness(ind));
      const current_best_idx = fitness_scores.indexOf(Math.max(...fitness_scores));

      // Update best ever solution if current generation has a better one
      if (fitness_scores[current_best_idx] > best_ever_fitness) {
        best_ever = population[current_best_idx];
        best_ever_fitness = fitness_scores[current_best_idx];
      }

      // Create new population starting with the best solution (elitism)
      const new_population = best_ever ? [best_ever] : [];

      // Fill rest of population with offspring
      while (new_population.length < this.population_size) {
        const parent1 = this.tournamentSelection(population);
        const parent2 = this.tournamentSelection(population);
        const child = this.crossover(parent1, parent2);
        const mutated_child = this.mutate(child);
        if (mutated_child.isValid()) {
          new_population.push(mutated_child);
        }
      }

      population = new_population;
    }

    const solutions = population.slice(0, 10);
    const fitnessScores = solutions.map(solution => this.calculateFitness(solution));

    return { solutions, fitnessScores };
  }
}

/**
 * Formats a solution into a human-readable string.
 * Includes crop names, harvests per year, allocated acres, and yearly profit.
 */
export function formatSolution(allocation: FarmAllocation, fitness: number): string {
  const crop1 = cropOptions[allocation.crop1_index];
  const crop2 = cropOptions[allocation.crop2_index];
  const harvests1 = 365 / crop1.growth_time;
  const harvests2 = 365 / crop2.growth_time;
  
  return `${crop1.name} (${harvests1.toFixed(1)} colheitas/ano): ${allocation.crop1_acres} acres, ` +
         `${crop2.name} (${harvests2.toFixed(1)} colheitas/ano): ${allocation.crop2_acres} acres = ` +
         `${Math.floor(fitness)} lucro/ano`;
}
