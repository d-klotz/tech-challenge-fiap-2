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

export interface GenerationStats {
  generation: number;
  bestFitness: number;
  averageFitness: number;
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
   * Sorts the crop indices and acres to treat allocations as equivalent if they have
   * the same crops and acres, regardless of order.
   */
  getNormalizedKey(): string {
    const crops = [
      { index: this.crop1_index, acres: this.crop1_acres },
      { index: this.crop2_index, acres: this.crop2_acres },
    ];
    // Sort crops by index to normalize the order
    crops.sort((a, b) => a.index - b.index);
    // Create a string key representing the allocation
    return JSON.stringify({
      crops: [crops[0].index, crops[1].index],
      acres: [crops[0].acres, crops[1].acres],
    });
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
  private cropOptions: CropOption[];  // Available crop options
  public generationStats: GenerationStats[] = [];

  constructor(population_size: number = 100, mutation_rate: number = 0.2, cropOptions: CropOption[], plotSize: number, growthTime: number) {
    this.population_size = population_size;
    this.mutation_rate = mutation_rate;
    this.total_acres = plotSize;
    this.max_growth_time = growthTime;
    this.days_per_year = 365;
    this.cropOptions = cropOptions;
    this.generationStats = [];
  }

  /**
   * Generates a random pair of different crop indices.
   * Used in creating initial population and mutations.
   */
  private generateValidCropPair(): [number, number] {
    const crop1_index = Math.floor(Math.random() * this.cropOptions.length);
    let crop2_index;
    do {
      crop2_index = Math.floor(Math.random() * this.cropOptions.length);
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

      // Randomly allocate acres ensuring total acres sum to total_acres
      const min_acres_crop1 = 1;
      const max_acres_crop1 = this.total_acres - 1; // At least 1 acre for crop2
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
   */
  private calculateFitness(allocation: FarmAllocation): number {
    if (!allocation.isValid()) {
      return 0;
    }

    const crop1 = this.cropOptions[allocation.crop1_index];
    const crop2 = this.cropOptions[allocation.crop2_index];

    // Check constraints
    if (
      allocation.crop1_acres + allocation.crop2_acres !== this.total_acres ||
      crop1.growth_time > this.max_growth_time ||
      crop2.growth_time > this.max_growth_time
    ) {
      return 0;
    }

    // Calculate harvests per year for each crop
    const harvests_per_year_crop1 = Math.floor(this.days_per_year / crop1.growth_time);
    const harvests_per_year_crop2 = Math.floor(this.days_per_year / crop2.growth_time);

    // Calculate units of each crop based on space requirements
    const units_crop1 = Math.floor(allocation.crop1_acres / crop1.space_required);
    const units_crop2 = Math.floor(allocation.crop2_acres / crop2.space_required);

    // Calculate yearly revenue
    const revenue_crop1 = units_crop1 * crop1.yield * harvests_per_year_crop1;
    const revenue_crop2 = units_crop2 * crop2.yield * harvests_per_year_crop2;

    // Calculate yearly costs
    const costs_crop1 = units_crop1 * crop1.cost * harvests_per_year_crop1;
    const costs_crop2 = units_crop2 * crop2.cost * harvests_per_year_crop2;

    const total_profit = revenue_crop1 + revenue_crop2 - costs_crop1 - costs_crop2;

    return Math.max(0, total_profit);
  }

  /**
   * Implements tournament selection for choosing parents.
   * Randomly selects a subset of solutions and returns the one with highest fitness.
   * This helps maintain diversity while still favoring better solutions.
   */
  private tournamentSelection(population: FarmAllocation[], fitness_scores: number[], tournament_size: number = 5): FarmAllocation {
    const tournament_indices = Array.from({ length: tournament_size }, () => 
      Math.floor(Math.random() * population.length)
    );
    let best_index = tournament_indices[0];
    let best_fitness = fitness_scores[best_index];
    for (const idx of tournament_indices) {
      if (fitness_scores[idx] > best_fitness) {
        best_index = idx;
        best_fitness = fitness_scores[idx];
      }
    }
    return population[best_index];
  }

  /**
   * Creates a new solution by combining aspects of two parent solutions.
   * Uses two crossover strategies:
   * 1. Inherit crop choices from one parent and acreage from another
   * 2. Mix crop choices and calculate new acreage based on parents
   */
  private crossover(parent1: FarmAllocation, parent2: FarmAllocation): FarmAllocation {
      // Strategy 2: Mix crops and calculate new acreage
      const crop1_index = Math.random() < 0.5 ? parent1.crop1_index : parent2.crop1_index;
      const other_crops = Array.from({ length: this.cropOptions.length }, (_, i) => i)
        .filter(i => i !== crop1_index);
      const crop2_index = other_crops[Math.floor(Math.random() * other_crops.length)];

      // Average parents' acreage with small random variation
      const base_acres = Math.floor((parent1.crop1_acres + parent2.crop1_acres) / 2);
      const variation = Math.floor(Math.random() * 3) - 1;
      const crop1_acres = Math.max(1, Math.min(this.total_acres - 1, base_acres + variation));
      const crop2_acres = this.total_acres - crop1_acres;

      return new FarmAllocation(crop1_index, crop2_index, crop1_acres, crop2_acres);
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
        const available_crops = Array.from({ length: this.cropOptions.length }, (_, i) => i)
          .filter(i => i !== allocation.crop2_index);
        allocation.crop1_index = available_crops[Math.floor(Math.random() * available_crops.length)];
      } else if (mutation_type === 1) {
        // Change second crop
        const available_crops = Array.from({ length: this.cropOptions.length }, (_, i) => i)
          .filter(i => i !== allocation.crop1_index);
        allocation.crop2_index = available_crops[Math.floor(Math.random() * available_crops.length)];
      } else {
        // Adjust acreage
        const shift = Math.floor(Math.random() * 5) - 2; // Random shift between -2 and +2
        allocation.crop1_acres = Math.max(1, Math.min(this.total_acres - 1, allocation.crop1_acres + shift));
        allocation.crop2_acres = this.total_acres - allocation.crop1_acres;
      }
    }
    return allocation;
  }

  /**
   * Runs the genetic algorithm for the specified number of generations.
   * Implements elitism by keeping the best solution across generations.
   * Returns the top 10 unique solutions found along with their fitness scores.
   */
  public async run(generations: number = 150, onGenerationComplete?: (stats: GenerationStats) => void): Promise<{ solutions: FarmAllocation[], fitnessScores: number[] }> {
    let population = this.generateInitialPopulation();
    let best_ever: FarmAllocation | null = null;
    let best_ever_fitness = Number.NEGATIVE_INFINITY;
    this.generationStats = [];

    for (let generation = 0; generation < generations; generation++) {
      const fitness_scores = population.map(ind => this.calculateFitness(ind));
      const current_best_idx = fitness_scores.indexOf(Math.max(...fitness_scores));
      const average_fitness = fitness_scores.reduce((a, b) => a + b, 0) / fitness_scores.length;

      // Store generation statistics
      const stats: GenerationStats = {
        generation,
        bestFitness: Math.max(...fitness_scores),
        averageFitness: average_fitness
      };
      this.generationStats.push(stats);

      // Notify progress if callback is provided
      if (onGenerationComplete) {
        onGenerationComplete(stats);
      }

      // Update best ever solution if current generation has a better one
      if (fitness_scores[current_best_idx] > best_ever_fitness) {
        best_ever = population[current_best_idx];
        best_ever_fitness = fitness_scores[current_best_idx];
      }

      // Create new population starting with the best solution (elitism)
      const new_population = best_ever ? [best_ever] : [];

      // Fill rest of population with offspring
      while (new_population.length < this.population_size) {
        const parent1 = this.tournamentSelection(population, fitness_scores);
        const parent2 = this.tournamentSelection(population, fitness_scores);
        const child = this.crossover(parent1, parent2);
        const mutated_child = this.mutate(child);
        if (mutated_child.isValid()) {
          new_population.push(mutated_child);
        }
      }

      population = new_population;

      // Add a small delay to allow UI updates
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Calculate fitness for all individuals
    const final_fitness_scores = population.map(ind => this.calculateFitness(ind));

    // Combine allocations with their fitness scores
    const population_with_fitness = population.map((allocation, idx) => ({
      allocation,
      fitness: final_fitness_scores[idx],
    }));

    // Sort the population by fitness in descending order
    population_with_fitness.sort((a, b) => b.fitness - a.fitness);

    // Collect top unique solutions
    const solutions: FarmAllocation[] = [];
    const fitnessScores: number[] = [];
    const seen_keys = new Set<string>();

    for (const { allocation, fitness } of population_with_fitness) {
      const key = allocation.getNormalizedKey();
      if (!seen_keys.has(key)) {
        seen_keys.add(key);
        solutions.push(allocation);
        fitnessScores.push(fitness);
      }
      if (solutions.length >= 10) {
        break;
      }
    }

    return { solutions, fitnessScores };
  }
}

/**
 * Formats a solution into a human-readable string.
 * Includes crop names, harvests per year, allocated acres, and yearly profit.
 */
export function formatSolution(allocation: FarmAllocation, fitness: number, cropOptions: CropOption[]): string {
  const crop1 = cropOptions[allocation.crop1_index];
  const crop2 = cropOptions[allocation.crop2_index];
  const harvests1 = Math.floor(365 / crop1.growth_time);
  const harvests2 = Math.floor(365 / crop2.growth_time);

  return `Cultura 1: ${crop1.name} (${allocation.crop1_acres} acres, ${harvests1} colheitas/ano)\n` +
         `Cultura 2: ${crop2.name} (${allocation.crop2_acres} acres, ${harvests2} colheitas/ano)\n` +
         `Lucro Anual Estimado: ${new Intl.NumberFormat('en-US', { 
           style: 'currency', 
           currency: 'USD',
           maximumFractionDigits: 0 
         }).format(Math.floor(fitness))}`;
}
