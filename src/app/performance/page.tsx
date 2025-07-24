"use client";
import MyChart from "@/components/chart/LineChart";
import { H3 } from "@/components/Heading/H3";
import PerformanceService from "@/service/performanceService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function MyPerformance() {
  const [data, setData] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const result = await PerformanceService.getPerformanceByUser();

        const fullMonthLabels = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

     
      const performanceMap: Record<string, number> = {};
      result.forEach((item: any) => {
        const day = dayjs(item.date).date().toString(); 
        performanceMap[day] = item.performance;
      });

      
      const datasetData = fullMonthLabels.map((day) => performanceMap[day] ?? 0);

        setData({
          labels:fullMonthLabels,
          datasets: [
            {
              label: "Performance Score",
              data: datasetData,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching performance:", error);
      }
    }

    fetchPerformance();
  }, []);

  return (
    <div>
      <H3 className="">My Performance</H3>
      <div style={{ width: "70%", margin: "auto" }}>
        <MyChart data={data} />
      </div>
    </div>
  );
}
