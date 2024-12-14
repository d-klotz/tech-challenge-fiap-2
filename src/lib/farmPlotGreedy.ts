import { CropOption } from './farmPlotAllocation';

export class FarmPlotGreedy {
    private total_acres: number;
    private max_growth_time: number;
    private days_per_year: number;
    private cropOptions: CropOption[];

    constructor(cropOptions: CropOption[], plotSize: number, growthTime: number) {
        this.total_acres = plotSize;
        this.max_growth_time = growthTime;
        this.days_per_year = 365;
        this.cropOptions = cropOptions;
    }

    private calculateProfitPerAcre(crop: CropOption): number {
        // Skip if growth time exceeds maximum
        if (crop.growth_time > this.max_growth_time) {
            return 0;
        }

        // Calculate harvests per year
        const harvests_per_year = Math.floor(this.days_per_year / crop.growth_time);

        // Calculate units per acre
        const units_per_acre = 1 / crop.space_required;

        // Calculate yearly profit per acre
        const revenue_per_acre = units_per_acre * crop.yield * harvests_per_year;
        const cost_per_acre = units_per_acre * crop.cost * harvests_per_year;
        
        return revenue_per_acre - cost_per_acre;
    }

    public findBestAllocation(): {
        crop1: CropOption;
        crop2: CropOption;
        crop1_acres: number;
        crop2_acres: number;
        yearly_profit: number;
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

        // Simple allocation: 70% to best crop, 30% to second best
        const crop1_acres = Math.floor(this.total_acres * 0.7);
        const crop2_acres = this.total_acres - crop1_acres;

        // Calculate total yearly profit
        const profit1 = this.calculateProfitPerAcre(bestCrop) * crop1_acres;
        const profit2 = this.calculateProfitPerAcre(secondBestCrop) * crop2_acres;

        return {
            crop1: bestCrop,
            crop2: secondBestCrop,
            crop1_acres,
            crop2_acres,
            yearly_profit: profit1 + profit2
        };
    }
}

export function formatGreedySolution(solution: {
    crop1: CropOption;
    crop2: CropOption;
    crop1_acres: number;
    crop2_acres: number;
    yearly_profit: number;
}): string {
    const harvests1 = Math.floor(365 / solution.crop1.growth_time);
    const harvests2 = Math.floor(365 / solution.crop2.growth_time);
    
    return `Cultura 1: ${solution.crop1.name} (${solution.crop1_acres} acres, ${harvests1} colheitas/ano)\n` +
           `Cultura 2: ${solution.crop2.name} (${solution.crop2_acres} acres, ${harvests2} colheitas/ano)\n` +
           `Lucro Anual Estimado: ${new Intl.NumberFormat('en-US', { 
             style: 'currency', 
             currency: 'USD',
             maximumFractionDigits: 0 
           }).format(Math.floor(solution.yearly_profit))}`;
}
