"use client";

import { useEffect } from "react";
import Chart from "chart.js/auto";

interface RevenueChartProps {
	transactions: { date: string; amount: number }[];
}

export default function RevenueChart({ transactions }: RevenueChartProps) {
	useEffect(() => {
		const ctx = document.getElementById("revenueChart") as HTMLCanvasElement;
		const chart = new Chart(ctx, {
			type: "line",
			data: {
				labels: transactions.map((t) => t.date),
				datasets: [
					{
						label: "Revenue ($)",
						data: transactions.map((t) => t.amount),
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
