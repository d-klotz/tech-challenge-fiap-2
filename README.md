# Alocação de Terreno Agrícola

**Otimização de Alocação de Culturas usando Algoritmo Genético**

## Visão Geral

Este projeto implementa um algoritmo genético para otimizar a alocação de duas culturas em uma área agrícola. O objetivo é maximizar o lucro anual considerando múltiplos fatores como tempo de crescimento, custos, rendimentos e número de colheitas possíveis por ano.

Para fins de comparação e validação, também implementamos uma solução convencional usando um algoritmo guloso, demonstrando as vantagens da abordagem genética para este problema complexo de otimização.

## Características Principais

- Otimização avançada através de algoritmo genético
- Suporte para múltiplas culturas com diferentes características
- Consideração de múltiplas colheitas por ano
- Bônus de diversificação para combinações otimizadas
- Visualização do progresso da evolução
- Interface web interativa
- Comparação com solução convencional para validação

## Parâmetros do Sistema

### Culturas Disponíveis
Cada cultura possui os seguintes atributos:
- Nome
- Espaço requerido (em acres)
- Custo por unidade
- Rendimento por unidade
- Tempo de crescimento (em dias)

### Restrições
- Área total configurável
- Tempo máximo de crescimento configurável
- Necessidade de culturas diferentes
- Mínimo de 1 acre por cultura

### Parâmetros do Algoritmo Genético
- População: 100 indivíduos
- Taxa de mutação: 20%
- Gerações: 150
- Seleção por torneio (5 indivíduos)
- Elitismo preservando melhor solução

## Funcionalidades

1. **Otimização de Alocação**
   - Encontra as 10 melhores combinações de duas culturas
   - Maximiza o lucro anual
   - Considera múltiplas colheitas por ano

2. **Visualização**
   - Acompanhamento em tempo real do progresso
   - Gráficos de evolução do fitness
   - Estatísticas por geração

3. **Resultados**
   - Top 10 melhores combinações únicas
   - Detalhes de alocação por cultura
   - Lucro anual estimado
   - Número de colheitas por ano

## Análise Comparativa dos Algoritmos

Este projeto implementa e compara duas abordagens distintas de otimização computacional aplicadas ao domínio agrícola:

### Algoritmo Genético (AG)
- **Otimização Global**: Implementa conceitos avançados de computação evolutiva para explorar o espaço de soluções de forma abrangente
- **Aprendizado Evolutivo**: Melhora progressivamente as soluções através de gerações, aumentando a probabilidade de encontrar a melhor combinação possível
- **Complexidade Espacial**: O(n² * A), onde n é o número de culturas e A é a área total, permitindo exploração extensiva do espaço de busca
- **Otimização Multi-objetivo**: Utiliza função fitness sofisticada para balancear múltiplos objetivos e restrições simultaneamente
- **Mecanismos Evolutivos**: Implementa operadores genéticos (crossover, mutação, seleção por torneio) para manter diversidade populacional e escapar de mínimos locais

### Algoritmo Guloso
- **Otimização Local**: Implementa heurística determinística baseada em decisões localmente ótimas
- **Complexidade Temporal**: O(n log n), oferecendo performance computacional superior
- **Solução Rápida**: Ideal para cenários onde tempo de processamento é crítico e soluções aproximadas são aceitáveis
- **Limitações**: Susceptível a mínimos locais devido à natureza determinística do algoritmo

### Conclusão Técnica
A implementação do AG demonstra superioridade em termos de qualidade de solução e robustez matemática. O algoritmo guloso serve como baseline comparativo e alternativa eficiente para casos onde performance computacional é prioritária sobre otimalidade global.

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

## Exemplo de Uso

O sistema apresentará as melhores combinações no formato:
```
[Cultura1] ([X] colheitas/ano): [Y] acres, 
[Cultura2] ([X] colheitas/ano): [Y] acres = 
[Z] lucro/ano
```

## Estrutura do Projeto

- `src/lib/farmPlotAllocation.ts`: Implementação principal do algoritmo genético
- `src/app/page.tsx`: Página principal da aplicação
- `TECHNICAL_REPORT.md`: Documentação técnica detalhada do algoritmo genético
- `src/lib/farmPlotGreedy.ts`: Implementação de solução convencional para comparação

## Contribuindo

Contribuições são bem-vindas! Por favor, sinta-se à vontade para submeter pull requests ou abrir issues para melhorias.

## Licença

Este projeto está sob a licença MIT.
