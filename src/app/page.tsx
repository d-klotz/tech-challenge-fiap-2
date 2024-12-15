'use client'

import { useState } from 'react';
import { FarmPlotGA, formatSolution, CropOption, cropOptions, GenerationStats } from '../lib/farmPlotAllocation';
import { FarmPlotGreedy, formatGreedySolution } from '../lib/farmPlotGreedy';
import { Trash } from 'lucide-react';
import { ResponsiveLine } from '@nivo/line';

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [greedyResult, setGreedyResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [editableCropOptions, setEditableCropOptions] = useState<CropOption[]>(cropOptions);
  const [plotSize, setPlotSize] = useState<number>(100);
  const [growthTime, setGrowthTime] = useState<number>(150);
  const [generationStats, setGenerationStats] = useState<GenerationStats[]>([]);

  const runAlgorithm = async () => {
    setIsLoading(true);
    setGenerationStats([]);

    // Run Genetic Algorithm
    const ga = new FarmPlotGA(100, 0.2, editableCropOptions, plotSize, growthTime);
    const { solutions, fitnessScores } = await ga.run(150, (stats) => {
      setGenerationStats(prev => [...prev, stats]);
    });

    const formattedResults = solutions.map((solution, index: number) =>
      formatSolution(solution, fitnessScores[index], editableCropOptions)
    );

    // Run Greedy Algorithm
    const greedyAlgorithm = new FarmPlotGreedy(editableCropOptions, plotSize, growthTime);
    const greedySolution = greedyAlgorithm.findBestAllocation();
    const formattedGreedySolution = formatGreedySolution(greedySolution);

    setResults(formattedResults);
    setGreedyResult(formattedGreedySolution);
    setIsLoading(false);
  };

  const handleSaveChanges = (index: number, crop: CropOption) => {
    const newCropOptions = [...editableCropOptions];
    newCropOptions[index] = crop;
    setEditableCropOptions(newCropOptions);
  };

  const handleDeleteRow = (index: number) => {
    const newCropOptions = [...editableCropOptions];
    newCropOptions.splice(index, 1);
    setEditableCropOptions(newCropOptions);
  };

  const handleAddNewCrop = () => {
    const newCropOptions = [...editableCropOptions];
    newCropOptions.push({
      name: '',
      space_required: 0,
      cost: 0,
      yield: 0,
      growth_time: 0,
    });
    setEditableCropOptions(newCropOptions);
  };

  const chartData = [
    {
      id: 'Best Fitness',
      data: generationStats.map(stat => ({
        x: stat.generation,
        y: stat.bestFitness
      }))
    },
    {
      id: 'Average Fitness',
      data: generationStats.map(stat => ({
        x: stat.generation,
        y: stat.averageFitness
      }))
    }
  ];

  return (
    <main className="min-h-screen px-48 py-8 bg-gradient-to-b from-green-50 to-green-100">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
          🌾 Otimizador de Alocação de Terreno Agrícola 🌱
        </h1>

        <div className='flex flex-col'>
          <div className='flex flex-col m-3'>
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-6 rounded-lg shadow-lg border border-green-200">
              <div className="flex flex-col gap-2">
                <label className="text-green-800 font-semibold">🗺️ Tamanho do terreno:</label>
                <label className="text-green-600 text-xs">em acres</label>
                <input
                  type="text"
                  value={plotSize}
                  onChange={(e) => setPlotSize(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-green-200 text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-green-800 font-semibold">⏱️ Tempo de crescimento:</label>
                <label className="text-green-600 text-xs">em dias</label>
                <input
                  type="text"
                  value={growthTime}
                  onChange={(e) => setGrowthTime(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-green-200 text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8 border border-green-200">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-4 py-2">🌱 Cultura</th>
                    <th className="px-4 py-2">📏 Espaço (acres)</th>
                    <th className="px-4 py-2">💰 Custo</th>
                    <th className="px-4 py-2">📈 Rendimento</th>
                    <th className="px-4 py-2">🕒 Tempo (dias)</th>
                    <th className="px-4 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {editableCropOptions.map((crop, index) => (
                    <tr key={index} className="border-b hover:bg-green-50">
                      <td className="px-4 py-2">
                        <input
                          type="text"
                          value={crop.name}
                          onChange={(e) => handleSaveChanges(index, { ...crop, name: e.target.value })}
                          className="w-full p-1 border rounded text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={crop.space_required}
                          onChange={(e) => handleSaveChanges(index, { ...crop, space_required: Number(e.target.value) })}
                          className="w-full p-1 border rounded text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={crop.cost}
                          onChange={(e) => handleSaveChanges(index, { ...crop, cost: Number(e.target.value) })}
                          className="w-full p-1 border rounded text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={crop.yield}
                          onChange={(e) => handleSaveChanges(index, { ...crop, yield: Number(e.target.value) })}
                          className="w-full p-1 border rounded text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={crop.growth_time}
                          onChange={(e) => handleSaveChanges(index, { ...crop, growth_time: Number(e.target.value) })}
                          className="w-full p-1 border rounded text-green-800 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleDeleteRow(index)}
                          className="p-2 text-red-600 hover:text-red-800 transition-colors duration-150"
                        >
                          <Trash size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center">
                      <button
                        onClick={handleAddNewCrop}
                        className="px-4 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 active:bg-green-800 transition-colors duration-150"
                      >
                        🌱 Adicionar Nova Cultura
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              onClick={runAlgorithm}
              disabled={isLoading}
              className="w-full mb-4 px-6 py-3 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 transition-colors duration-150 shadow-lg"
            >
              {isLoading ? '🔄 Calculando...' : '🚜 Executar Otimização'}
            </button>

            <div>
              {generationStats.length > 0 && (
                <div className="bg-white rounded-lg p-6 my-6 shadow-lg border border-green-200">
                  <h2 className="text-xl font-semibold mb-4 text-green-800">
                    📊 Evolução do Algoritmo Genético
                  </h2>
                  <div style={{ height: '400px' }}>
                    <ResponsiveLine
                      data={chartData}
                      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                      xScale={{ type: 'linear' }}
                      yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: false,
                        reverse: false
                      }}
                      yFormat=" >-.2f"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Geração',
                        legendOffset: 36,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Fitness',
                        legendOffset: -40,
                        legendPosition: 'middle'
                      }}
                      enablePoints={false}
                      lineWidth={2}
                      enableArea={true}
                      areaOpacity={0.1}
                      useMesh={true}
                      legends={[
                        {
                          anchor: 'bottom-right',
                          direction: 'column',
                          justify: false,
                          translateX: 100,
                          translateY: 0,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 80,
                          itemHeight: 20,
                          itemOpacity: 0.75,
                          symbolSize: 12,
                          symbolShape: 'circle',
                          symbolBorderColor: 'rgba(0, 0, 0, .5)',
                          effects: [
                            {
                              on: 'hover',
                              style: {
                                itemBackground: 'rgba(0, 0, 0, .03)',
                                itemOpacity: 1
                              }
                            }
                          ]
                        }
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-4 text-green-800">
                <p>🌱 Calculando melhores alocações...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.length > 0 && (
                  <div className="flex flex-col rounded-lg overflow-hidden">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
                      <div className="bg-green-700 text-white px-4 py-2">
                        <h2 className="text-xl font-bold">🌾 Resultados do Algoritmo Genético</h2>
                      </div>
                      <div className="p-4">
                        {results.map((result, index) => (
                          <div key={index} className="mb-4 last:mb-0">
                            <div className="font-semibold text-green-800 mb-1">Solução #{index + 1}</div>
                            <pre className="bg-green-50 p-4 rounded-lg text-green-800 whitespace-pre-wrap border border-green-200">
                              {result}
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {greedyResult && (
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-green-200">
                    <div className="bg-green-700 text-white px-4 py-2">
                      <h2 className="text-xl font-bold">🚜 Resultado do Greedy Algorithm</h2>
                    </div>
                    <div className="p-4">
                      <pre className="bg-green-50 p-4 rounded-lg text-green-800 whitespace-pre-wrap border border-green-200">
                        {greedyResult}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
