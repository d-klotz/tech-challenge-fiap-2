import { CropOption } from './farmPlotAllocation';

export class FarmPlotGreedy {
    private totalAcres: number;
    private maxGrowthTime: number;
    private daysPerYear: number;
    private cropOptions: CropOption[];

    constructor(cropOptions: CropOption[], plotSize: number, growthTime: number) {
        this.totalAcres = plotSize;
        this.maxGrowthTime = growthTime;
        this.daysPerYear = 365;
        this.cropOptions = cropOptions;
    }

    private calculateProfitPerAcre(crop: CropOption): number {
        // Skip if growth time exceeds maximum
        if (crop.growth_time > this.maxGrowthTime) {
            return 0;
        }

        // Calculate harvests per year
        const harvestsPerYear = Math.floor(this.daysPerYear / crop.growth_time);

        // Calculate units per acre
        const unitsPerAcre = 1 / crop.space_required;

        // Calculate yearly profit per acre
        const revenuePerAcre = unitsPerAcre * crop.yield * harvestsPerYear;
        const costPerAcre = unitsPerAcre * crop.cost * harvestsPerYear;
        
        return revenuePerAcre - costPerAcre;
    }

    public findBestAllocation(): {
        crop1: CropOption;
        crop2: CropOption;
        crop1Acres: number;
        crop2Acres: number;
        yearlyProfit: number;
    } {
        // Calculate profit per acre for each crop
        const cropProfits = this.cropOptions.map((crop, index) => ({
            crop,
            profitPerAcre: this.calculateProfitPerAcre(crop),
            index
        }));

        // Sort crops by profit per acre (descending)
        cropProfits.sort((a, b) => b.profitPerAcre - a.profitPerAcre);

        // Take the top two most profitable crops
        const bestCrop = cropProfits[0].crop;
        const secondBestCrop = cropProfits[1].crop;

        // Give most land to the most profitable crop
        const crop1Acres = this.totalAcres - 1; // Leave just 1 acre for the second crop
        const crop2Acres = 1; // Minimum allocation for second crop

        // Calculate total yearly profit
        const profit1 = this.calculateProfitPerAcre(bestCrop) * crop1Acres;
        const profit2 = this.calculateProfitPerAcre(secondBestCrop) * crop2Acres;

        return {
            crop1: bestCrop,
            crop2: secondBestCrop,
            crop1Acres,
            crop2Acres,
            yearlyProfit: profit1 + profit2
        };
    }
}

export function formatGreedySolution(solution: {
    crop1: CropOption;
    crop2: CropOption;
    crop1Acres: number;
    crop2Acres: number;
    yearlyProfit: number;
}): string {
    const harvests1 = Math.floor(365 / solution.crop1.growth_time);
    const harvests2 = Math.floor(365 / solution.crop2.growth_time);
    
    return `Cultura 1: ${solution.crop1.name} (${solution.crop1Acres} acres, ${harvests1} colheitas/ano)\n` +
           `Cultura 2: ${solution.crop2.name} (${solution.crop2Acres} acres, ${harvests2} colheitas/ano)\n` +
           `Lucro Anual Estimado: ${new Intl.NumberFormat('en-US', { 
             style: 'currency', 
             currency: 'USD',
             maximumFractionDigits: 0 
           }).format(Math.floor(solution.yearlyProfit))}`;
}
