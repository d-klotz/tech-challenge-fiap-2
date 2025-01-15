from pulp import LpMaximize, LpProblem, LpVariable, LpStatus

# Dados das culturas
# crop_options = [
#     {"name": "Milho", "space_required": 1, "cost": 150, "yield": 400, "growth_time": 120},
#     {"name": "Soja", "space_required": 1, "cost": 100, "yield": 300, "growth_time": 120},
#     {"name": "Arroz", "space_required": 1, "cost": 180, "yield": 500, "growth_time": 150},
#     {"name": "Batata", "space_required": 0.5, "cost": 80, "yield": 200, "growth_time": 90},
#     {"name": "Tomate", "space_required": 0.5, "cost": 100, "yield": 300, "growth_time": 90},
#     {"name": "Cenoura", "space_required": 0.25, "cost": 60, "yield": 150, "growth_time": 60},
#     {"name": "Pepino", "space_required": 0.25, "cost": 80, "yield": 200, "growth_time": 60},
#     {"name": "Pimentão", "space_required": 0.5, "cost": 120, "yield": 250, "growth_time": 90},
#     {"name": "Cebola", "space_required": 0.25, "cost": 60, "yield": 150, "growth_time": 60},
#     {"name": "Trigo", "space_required": 1, "cost": 120, "yield": 250, "growth_time": 90},
# ]
# Valores que "quebram" o algoritmo de PL
crop_options = [
    {"name": "Milho", "space_required": 1.5, "cost": 180, "yield": 500, "growth_time": 120},
    {"name": "Soja", "space_required": 1.2, "cost": 150, "yield": 400, "growth_time": 120},
    {"name": "Arroz", "space_required": 1.3, "cost": 200, "yield": 600, "growth_time": 150},
    {"name": "Batata", "space_required": 0.8, "cost": 120, "yield": 300, "growth_time": 90},
    {"name": "Tomate", "space_required": 0.9, "cost": 150, "yield": 400, "growth_time": 90},
    {"name": "Cenoura", "space_required": 0.5, "cost": 80, "yield": 200, "growth_time": 60},
    {"name": "Pepino", "space_required": 0.7, "cost": 100, "yield": 300, "growth_time": 60},
    {"name": "Pimentão", "space_required": 1.0, "cost": 180, "yield": 350, "growth_time": 90},
    {"name": "Cebola", "space_required": 0.5, "cost": 80, "yield": 200, "growth_time": 60},
    {"name": "Trigo", "space_required": 1.4, "cost": 160, "yield": 400, "growth_time": 90},
]

# Parâmetros
total_acres = 100  # Espaço total disponível
max_growth_time = 150  # Tempo máximo de crescimento permitido

# Lista para armazenar as melhores soluções
solutions = []

# Iterar sobre todas as combinações de culturas
for i in range(len(crop_options)):
    for j in range(i + 1, len(crop_options)):
        crop1 = crop_options[i]
        crop2 = crop_options[j]

        # Verificar restrições de tempo máximo de crescimento
        if crop1["growth_time"] > max_growth_time or crop2["growth_time"] > max_growth_time:
            continue

        # Criar problema de otimização
        problem = LpProblem("Farm_Optimization", LpMaximize)

        # Variáveis de decisão
        x1 = LpVariable("Acres_Crop1", lowBound=1, cat="Continuous")
        x2 = LpVariable("Acres_Crop2", lowBound=1, cat="Continuous")

        # Número de colheitas por ano
        harvests1 = 365 // crop1["growth_time"]
        harvests2 = 365 // crop2["growth_time"]

        # Número de unidades por acre
        units_per_acre1 = 1 / crop1["space_required"]
        units_per_acre2 = 1 / crop2["space_required"]

        # Produção total por acre
        production1 = harvests1 * units_per_acre1
        production2 = harvests2 * units_per_acre2

        # Função objetivo: Maximizar lucro
        profit = (
            (crop1["yield"] - crop1["cost"]) * production1 * x1
            + (crop2["yield"] - crop2["cost"]) * production2 * x2
        )
        problem += profit

        # Restrição: Soma das áreas alocadas deve ser exatamente igual ao total disponível
        problem += (x1 + x2) == total_acres

        # Resolver o problema
        problem.solve()

        # Avaliar se a solução atual é ótima e armazenar na lista de soluções
        if LpStatus[problem.status] == "Optimal":
            solutions.append({
                "crop1": crop1["name"],
                "crop2": crop2["name"],
                "acres_crop1": x1.value(),
                "acres_crop2": x2.value(),
                "harvests_crop1": harvests1,
                "harvests_crop2": harvests2,
                "total_profit": problem.objective.value(),
            })

# Classificar soluções pelo lucro total em ordem decrescente
solutions = sorted(solutions, key=lambda x: x["total_profit"], reverse=True)

# Exibir as 10 melhores soluções
print("Top 10 Soluções:")
for rank, solution in enumerate(solutions[:10], start=1):
    print(f"\nSolução {rank}:")
    print(f"  Cultura 1: {solution['crop1']} - {solution['acres_crop1']} acres, {solution['harvests_crop1']} colheitas/ano")
    print(f"  Cultura 2: {solution['crop2']} - {solution['acres_crop2']} acres, {solution['harvests_crop2']} colheitas/ano")
    print(f"  Lucro Total: {solution['total_profit']}")


# Motivo da PL não apresentar soluções com 98 ou 97 acres:
# Coincidentemente nosso problema tem uma solução ótima com 99 acres de uma cultura, mas se não fosse esse o caso, a PL
# Não seria tão eficaz em nos apontar a melhor solução:
# PL explora soluções que maximizam uma variável ou conjunto de variáveis porque, geometricamente,
# as funções lineares atingem seus extremos nos vértices da região factível. Essa propriedade permite
# que métodos como o Simplex naveguem eficientemente pelo espaço de soluções, diferentemente de algoritmos gulosos
# ou genéticos, que não se beneficiam diretamente dessa característica geométrica dos problemas lineares.
