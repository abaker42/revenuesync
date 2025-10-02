"use client";

import { useEffect } from "react";
import Chart from "chart.js/auto";

interface RevenueChartProps {
	transactions: { date: string; amount: number }[];
}

export default function RevenueChart({ transactions }: RevenueChartProps) {
	useEffect(() => {
		// Aggregate transactions by date: sum amounts for each unique date
		const aggregated = transactions.reduce((acc: Map<string, number>, t) => {
			const currentSum = acc.get(t.date) || 0;
			acc.set(t.date, currentSum + t.amount);
			return acc;
		}, new Map<string, number>());

		// Sort dates chronologically (assuming 'YYYY-MM-DD' format for sorting)
		const sortedDates = Array.from(aggregated.keys()).sort();

		// Prepare chart data
		const labels = sortedDates;
		const data = sortedDates.map((date) => aggregated.get(date) || 0);

		const ctx = document.getElementById("revenueChart") as HTMLCanvasElement;
		const chart = new Chart(ctx, {
			type: "line",
			data: {
				labels,
				datasets: [
					{
						label: "Revenue ($)",
						data,
						borderColor: "#3b82f6",
						backgroundColor: "rgba(59, 130, 246, 0.2)",
						fill: true,
					},
				],
			},
			options: {
				responsive: true,
				scales: {
					y: { beginAtZero: true },
				},
			},
		});

		return () => chart.destroy();
	}, [transactions]);

	return <canvas id='revenueChart' width='400' height='200' />;
}

// export default function RevenueChart({ transactions }: RevenueChartProps) {
// 	useEffect(() => {
// 		const ctx = document.getElementById("revenueChart") as HTMLCanvasElement;
// 		const chart = new Chart(ctx, {
// 			type: "line",
// 			data: {
// 				labels: transactions.map((t) => t.date),
// 				datasets: [
// 					{
// 						label: "Revenue ($)",
// 						data: transactions.map((t) => t.amount),
// 						borderColor: "#3b82f6",
// 						backgroundColor: "rgba(59, 130, 246, 0.2)",
// 						fill: true,
// 					},
// 				],
// 			},
// 			options: {
// 				responsive: true,
// 				scales: {
// 					y: { beginAtZero: true },
// 				},
// 			},
// 		});

// 		return () => chart.destroy();
// 	}, [transactions]);

// 	return <canvas id='revenueChart' width='400' height='200' />;
// }
