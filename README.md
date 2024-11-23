# Alocação de Terreno Agrícola

**Layout de Implementação: Alocação de Terreno Agrícola para 2 Culturas Usando Abordagem Knapsack**

**Visão Geral do Cenário**

O agricultor possui 10 acres de terra agrícola e um tempo máximo fixo de crescimento de cultura de 260 dias. De 10 culturas disponíveis, o objetivo é determinar as 10 melhores combinações de **duas culturas** que maximizam o lucro (rendimento total). A solução deve respeitar as restrições de espaço e tempo de crescimento.

**Plano de Implementação**

**1. Definir Dados de Entrada**

• **Área Total da Fazenda (10 acres)**: O agricultor pode usar até 10 acres para plantio.

• **Culturas (10 tipos)**: Cada cultura possui atributos:
  - **Espaço necessário por unidade**: Terra necessária para cultivar uma unidade da cultura.
  - **Custo**: Custo por unidade da cultura.
  - **Rendimento**: Lucro ou produção por área unitária.
  - **Tempo de crescimento**: Tempo necessário para a cultura amadurecer.

**2. Restrições**

• **Limite de Terra**: A terra total alocada para duas culturas não pode exceder 10 acres.

• **Limite de Tempo de Crescimento**: Ambas as culturas devem ter tempos de crescimento que se encaixem em 260 dias.

• **Combinação de Duas Culturas**: Apenas combinações de duas culturas serão consideradas para alocação.

**3. Abordagem da Solução**

1. **Gerar Todas as Combinações de Duas Culturas**:
   - Usar as 10 opções de cultura para gerar todas as **combinações possíveis de 2 culturas**.

2. **Alocar Terra Entre as Duas Culturas**:
   - Para cada combinação, dividir os 10 acres otimamente entre as duas culturas.
   - Alocações possíveis incluem:
     - Cultura 1: X acres, Cultura 2: Y acres (onde X + Y = 10).

3. **Avaliar Cada Alocação**:
   - Para cada alocação:
     - Calcular o rendimento total
     - Calcular o custo total
     - Verificar restrições:
       - Terra total ≤ 10 acres
       - Tempo de crescimento ≤ 260 dias para ambas as culturas

4. **Classificar Combinações por Lucro**:
   - Ordenar as combinações válidas por lucro total (rendimento).
   - Manter as **10 melhores combinações** com o maior lucro.

**4. Saída**

• Uma lista classificada das **10 melhores combinações** de duas culturas, mostrando:
  - Nomes da Cultura 1 e Cultura 2
  - Acres alocados para cada cultura
  - Rendimento total (lucro)
  - Custo total (opcional, para decisões baseadas em custo)

**Exemplo de Saída**

Top 10 Combinações de Culturas:

1. Milho: 6 acres, Soja: 4 acres = 4200 lucro
2. Arroz: 5 acres, Batata: 5 acres = 4100 lucro
3. Tomate: 7 acres, Pepino: 3 acres = 4000 lucro
4. Milho: 5 acres, Arroz: 5 acres = 3900 lucro
...

**Etapas Principais para Implementação**

1. **Preparação de Dados**:
   - Definir atributos das culturas (espaço, custo, rendimento, tempo de crescimento)

2. **Gerar Combinações**:
   - Usar combinações de 2 culturas

3. **Otimizar Alocação**:
   - Para cada combinação, iterar sobre possíveis divisões de acres e calcular rendimento

4. **Verificação de Restrições**:
   - Garantir terra total ≤ 10 acres e tempo de crescimento ≤ 260 dias

5. **Classificação**:
   - Ordenar combinações válidas por lucro total e selecionar as 10 melhores

**Extensões**

• Permitir que o usuário especifique o tempo máximo de crescimento em vez de fixá-lo em 260 dias.

• Adicionar consciência de custo à classificação para encontrar combinações que sejam eficientes em termos de custo.

• Visualizar resultados (por exemplo, usando gráficos para comparar combinações).

Este layout fornece um roteiro claro passo a passo para resolver o problema usando uma abordagem estruturada, aproveitando a metodologia Knapsack e os princípios do Algoritmo Genético.

## Tecnologias Utilizadas

- TypeScript
- React
- Next.js
- Tailwind CSS

## Como Executar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Execute o projeto:
```bash
npm run dev
```
4. Acesse `http://localhost:3000` no seu navegador
