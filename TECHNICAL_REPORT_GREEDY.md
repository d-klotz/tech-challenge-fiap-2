# Análise Técnica: Algoritmo Guloso para Otimização de Alocação de Culturas

## 1. Visão Geral da Implementação

O arquivo `farmPlotGreedy.ts` implementa um algoritmo guloso para otimizar a alocação de duas culturas em uma área agrícola. O algoritmo toma decisões localmente ótimas, alocando a maior parte do terreno para a cultura mais lucrativa por acre.

## 2. Estruturas de Dados

### 2.1 Interface CropOption (Importada)
```typescript
interface CropOption {
  name: string;           // Nome da cultura
  space_required: number; // Espaço necessário em acres
  cost: number;          // Custo por unidade
  yield: number;         // Rendimento por unidade
  growth_time: number;   // Tempo de crescimento em dias
}
```

### 2.2 Classe FarmPlotGreedy
Propriedades principais:
- `totalAcres`: Área total disponível
- `maxGrowthTime`: Tempo máximo de crescimento permitido
- `daysPerYear`: Dias por ano (365)
- `cropOptions`: Array de opções de culturas

## 3. Parâmetros do Algoritmo

- **Dias por Ano**: 365 (para cálculo de colheitas)
- **Alocação Mínima**: 1 acre para a segunda cultura
- **Alocação Máxima**: (totalAcres - 1) para a cultura mais lucrativa

## 4. Componentes Principais do Algoritmo

### 4.1 Cálculo de Lucro por Acre
```typescript
private calculateProfitPerAcre(crop: CropOption): number
```
Considera:
1. Número de colheitas por ano por cultura
2. Unidades por acre (baseado no espaço requerido)
3. Receita e custos por unidade

Fórmula:
```
harvestsPerYear = Math.floor(365 / growth_time)
unitsPerAcre = 1 / space_required
revenuePerAcre = unitsPerAcre * yield * harvestsPerYear
costPerAcre = unitsPerAcre * cost * harvestsPerYear
profit = revenuePerAcre - costPerAcre
```

### 4.2 Encontrar Melhor Alocação
```typescript
public findBestAllocation(): {
    crop1: CropOption;
    crop2: CropOption;
    crop1Acres: number;
    crop2Acres: number;
    yearlyProfit: number;
}
```
Processo:
1. Calcula lucro por acre para cada cultura
2. Ordena culturas por lucratividade
3. Seleciona as duas culturas mais lucrativas
4. Aloca terreno (máximo para mais lucrativa, mínimo para segunda)
5. Calcula lucro total anual

## 5. Processo de Decisão

1. **Inicialização**:
   - Recebe opções de culturas, tamanho do terreno e tempo máximo de crescimento

2. **Avaliação de Culturas**:
   - Calcula lucratividade por acre para cada cultura
   - Considera múltiplas colheitas por ano
   - Descarta culturas com tempo de crescimento muito longo

3. **Seleção e Alocação**:
   - Escolhe as duas culturas mais lucrativas
   - Aloca (totalAcres - 1) para a mais lucrativa
   - Aloca 1 acre para a segunda mais lucrativa

4. **Cálculo Final**:
   - Determina lucro total baseado na alocação

## 6. Diferenças do Algoritmo Genético

1. **Simplicidade**:
   - Implementação mais simples e direta
   - Sem iterações ou evolução
   - Decisão única baseada em lucro por acre

2. **Performance**:
   - Execução mais rápida
   - Sem necessidade de múltiplas gerações
   - Resultado imediato

3. **Limitações**:
   - O algoritmo guloso toma decisões localmente ótimas, sempre alocando a maior parte do terreno para a cultura mais lucrativa por acre
   - Isso pode levar a uma solução sub-ótima, pois ele não considera combinações mais complexas que poderiam resultar em maior lucro total
   - O algoritmo genético, por outro lado, explora múltiplas combinações através de gerações, podendo encontrar soluções globalmente melhores

## 7. Complexidade Computacional

- **Cálculo de Lucro**: O(1) por cultura
- **Ordenação**: O(n log n) onde n é o número de culturas
- **Alocação**: O(1)
- **Complexidade Total**: O(n log n)

## 8. Possíveis Melhorias

1. **Alocação Dinâmica**:
   - Considerar diferentes proporções de alocação
   - Testar múltiplas distribuições de área

2. **Análise de Risco**:
   - Incorporar fatores de risco por cultura
   - Considerar variabilidade de rendimento

3. **Restrições Adicionais**:
   - Adicionar limites mínimos por cultura
   - Considerar rotação de culturas
   - Incluir restrições sazonais
