# Análise Técnica: Algoritmo Genético para Otimização de Alocação de Culturas

## 1. Visão Geral da Implementação

O arquivo `farmPlotAllocation.ts` implementa um algoritmo genético (GA) para otimizar a alocação de duas culturas em uma área agrícola. O objetivo é maximizar o lucro anual considerando múltiplas variáveis e restrições.

## 2. Estruturas de Dados

### 2.1 Interface CropOption
```typescript
interface CropOption {
  name: string;           // Nome da cultura
  space_required: number; // Espaço necessário em acres
  cost: number;          // Custo por unidade
  yield: number;         // Rendimento por unidade
  growth_time: number;   // Tempo de crescimento em dias
}
```

### 2.2 Classe FarmAllocation
Representa uma solução potencial com:
- `crop1_index`: Índice da primeira cultura
- `crop2_index`: Índice da segunda cultura
- `crop1_acres`: Acres alocados para primeira cultura
- `crop2_acres`: Acres alocados para segunda cultura

### 2.3 Interface GenerationStats
```typescript
interface GenerationStats {
  generation: number;      // Número da geração atual
  bestFitness: number;    // Melhor fitness da geração
  averageFitness: number; // Fitness médio da geração
}
```

## 3. Parâmetros do Algoritmo Genético

- **População**: 100 indivíduos (padrão)
- **Taxa de Mutação**: 0.2 (20% de chance)
- **Gerações**: 150 (padrão)
- **Tamanho do Torneio**: 5 indivíduos
- **Dias por Ano**: 365 (para cálculo de colheitas)

## 4. Componentes Principais do Algoritmo

### 4.1 Geração da População Inicial
```typescript
private generateInitialPopulation(): FarmAllocation[]
```
- Gera pares válidos de culturas aleatoriamente
- Calcula alocações de acres respeitando restrições
- Garante que a soma dos acres = área total disponível
- Verifica validade das alocações

### 4.2 Cálculo de Fitness
```typescript
private calculateFitness(allocation: FarmAllocation): number
```
Considera:
1. Número de colheitas por ano por cultura
2. Rendimento total por cultura
3. Custos totais
4. Bônus de diversidade (10% para culturas com requisitos diferentes de espaço)

Fórmula:
```
fitness = (revenue_crop1 + revenue_crop2) - (costs_crop1 + costs_crop2)
if (diferentes_requisitos_espaco) fitness *= 1.1
revenue_cropN = units * yield * harvests_per_year
costs_cropN = units * cost * harvests_per_year
harvests_per_year = 365 / growth_time
```

### 4.3 Seleção por Torneio
```typescript
private tournamentSelection(population: FarmAllocation[], tournament_size: number = 5)
```
- Seleciona 5 indivíduos aleatoriamente
- Retorna o melhor deles (maior fitness)
- Mantém diversidade genética

### 4.4 Crossover (Recombinação)
```typescript
private crossover(parent1: FarmAllocation, parent2: FarmAllocation)
```
Duas estratégias (50% de chance cada):
1. Herdar culturas do parent1 e acres do parent2
2. Misturar culturas e calcular nova alocação de acres com variação aleatória

### 4.5 Mutação
```typescript
private mutate(allocation: FarmAllocation)
```
Três tipos possíveis (escolhidos aleatoriamente):
1. Mudar primeira cultura
2. Mudar segunda cultura
3. Ajustar alocação de acres (±2 acres)

## 5. Processo de Evolução

1. **Inicialização**:
   - Gera população inicial aleatória
   - Verifica restrições básicas

2. **Loop Principal**:
   - Avalia fitness de cada solução
   - Mantém melhor solução (elitismo)
   - Seleciona pais por torneio
   - Aplica crossover
   - Aplica mutação
   - Cria nova população
   - Registra estatísticas da geração

3. **Critério de Parada**:
   - Número fixo de gerações (150 por padrão)

## 6. Restrições do Sistema

1. **Área Total**: Soma dos acres das duas culturas deve igualar a área total disponível
2. **Tempo de Crescimento**: Deve respeitar o tempo máximo definido
3. **Culturas Diferentes**: Não permite mesma cultura duas vezes
4. **Área Mínima**: ≥ 1 acre por cultura

## 7. Otimizações Implementadas

1. **Elitismo**: Preserva melhor solução entre gerações
2. **Normalização**: Trata [crop1, crop2] e [crop2, crop1] como equivalentes através do método getNormalizedKey()
3. **Bônus de Diversidade**: Incentiva combinações de culturas com diferentes requisitos de espaço
4. **Validação de Restrições**: Embutida no cálculo de fitness
5. **Variação Controlada**: Mutações de área limitadas a ±2 acres
6. **Monitoramento de Progresso**: Rastreamento de estatísticas por geração

## 8. Saída do Algoritmo

```typescript
interface Output {
  solutions: FarmAllocation[];    // Top 10 melhores soluções únicas
  fitnessScores: number[];       // Scores correspondentes
}
```

Formato de apresentação:
```
[Cultura1] ([X] colheitas/ano): [Y] acres, 
[Cultura2] ([X] colheitas/ano): [Y] acres = 
[Z] lucro/ano
```

## 9. Complexidade Computacional

- **Geração**: O(população_size)
- **Avaliação**: O(população_size)
- **Seleção**: O(população_size * tournament_size)
- **Total por Geração**: O(população_size * (1 + tournament_size))

## 10. Possíveis Melhorias

1. Implementar critério de convergência dinâmico
2. Adicionar adaptação dinâmica da taxa de mutação
3. Implementar crossover mais sofisticado para acres
4. Adicionar mais métricas de diversidade
5. Paralelizar avaliação de fitness
6. Implementar cache de fitness para soluções repetidas
7. Adicionar restrições de rotação de culturas
8. Considerar fatores climáticos/sazonais
9. Implementar seleção adaptativa do tamanho do torneio
10. Adicionar visualização em tempo real do progresso da evolução
