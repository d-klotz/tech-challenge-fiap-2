'use client'

import { useState } from 'react';
import { FarmPlotGA, formatSolution, CropOption, cropOptions } from '../lib/farmPlotAllocation';
import { Trash } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editableCropOptions, setEditableCropOptions] = useState<CropOption[]>(cropOptions);
  const [plotSize, setPlotSize] = useState<number>(100);
  const [growthTime, setGrowthTime] = useState<number>(150);

  const runAlgorithm = () => {
    setIsLoading(true);
    const ga = new FarmPlotGA(100, 0.2, editableCropOptions, plotSize, growthTime);
    const { solutions, fitnessScores } = ga.run(150);
    
    const formattedResults = solutions.map((solution, index) => 
      formatSolution(solution, fitnessScores[index], editableCropOptions)
    );
    
    setResults(formattedResults);
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

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Otimizador de Alocação de Terreno Agrícola
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-gray-800">Tamanho do terreno:</label>
            <label className="text-gray-500 text-xs">em acres</label>
            <input 
              type="text" 
              value={plotSize} 
              onChange={(e) => setPlotSize(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-gray-200 text-gray-800"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-gray-800">Tempo de crescimento:</label>
            <label className="text-gray-500 text-xs">em dias</label>
            <input 
              type="text" 
              value={growthTime} 
              onChange={(e) => setGrowthTime(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-gray-200 text-gray-800"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg mb-8">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-6 py-4 text-left font-semibold">Cultura</th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Espaço</span>
                    <span className="text-xs text-gray-300">(acres)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Custo</span>
                    <span className="text-xs text-gray-300">(por unidade)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Rendimento</span>
                    <span className="text-xs text-gray-300">(por unidade)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">
                  <div className="flex flex-col">
                    <span>Tempo</span>
                    <span className="text-xs text-gray-300">(dias)</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {editableCropOptions.map((crop: CropOption, index) => (
                <tr 
                  key={index}
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    hover:bg-blue-50 transition-colors duration-150
                  `}
                >
                  <td className="px-6 py-4 text-left font-medium text-gray-900">
                    <input 
                      type="text" 
                      value={crop.name} 
                      onChange={(e) => handleSaveChanges(index, { ...crop, name: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    <input 
                      type="number" 
                      value={crop.space_required} 
                      onChange={(e) => handleSaveChanges(index, { ...crop, space_required: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    <input 
                      type="number" 
                      value={crop.cost} 
                      onChange={(e) => handleSaveChanges(index, { ...crop, cost: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    <input 
                      type="number" 
                      value={crop.yield} 
                      onChange={(e) => handleSaveChanges(index, { ...crop, yield: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    <input 
                      type="number" 
                      value={crop.growth_time} 
                      onChange={(e) => handleSaveChanges(index, { ...crop, growth_time: Number(e.target.value) })}
                      className="w-full p-2 rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-4 text-right text-gray-600">
                    <button 
                      onClick={() => handleDeleteRow(index)} 
                      className="px-4 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 active:bg-red-800"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                  <button 
                    onClick={handleAddNewCrop} 
                    className="px-4 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 active:bg-green-800"
                  >
                    Adicionar nova cultura
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={runAlgorithm}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-lg text-white font-semibold mb-8 w-full sm:w-auto
            transition-colors duration-150
            ${isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }
          `}
        >
          {isLoading ? 'Executando Algoritmo...' : 'Executar Otimização'}
        </button>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Top 10 Combinações de Culturas:
            </h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600
                           hover:bg-blue-50 hover:border-blue-200 transition-colors duration-150"
                >
                  <span className="font-semibold text-gray-800">#{index + 1}</span> {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
