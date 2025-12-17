import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Doughnut, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Graphs({ userData }) {
  // Default data structure - easily replaceable with backend data
  const defaultData = {
    scoreHistory: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Current'],
      scores: [580, 620, 650, 670, 685, 690, 695]
    },
    riskBand: {
      currentBand: 'Low Risk - High Need',
      level: 25, // 0-100 scale for gauge
      description: 'Excellent repayment history with genuine financial need'
    },
    financialHealth: {
      categories: ['Electricity', 'Mobile', 'Bill Payments'],
      yourSpending: [1800, 450, 95], // Last one is percentage
      healthyMin: [1000, 300, 90],
      healthyMax: [2500, 600, 100]
    }
  }

  // Use props data if available, otherwise use default data
  const data = userData || defaultData

  // Chart options for consistent styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  }

  // 1. Score History Line Chart
  const scoreHistoryConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Your Score Journey',
        color: '#1f2937'
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        min: 300,
        max: 900,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          callback: function(value) {
            return value
          }
        }
      }
    }
  }

  const scoreHistoryData = {
    labels: data.scoreHistory.labels,
    datasets: [
      {
        label: 'Credit Score',
        data: data.scoreHistory.scores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1d4ed8',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  }

  // 2. Risk Band Gauge Chart
  const riskGaugeConfig = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Your Risk Band',
        color: '#1f2937'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${data.riskBand.currentBand}`
          }
        }
      }
    },
    cutout: '70%',
    circumference: 180,
    rotation: 270
  }

  const riskGaugeData = {
    labels: ['Your Level', 'Remaining'],
    datasets: [
      {
        data: [data.riskBand.level, 100 - data.riskBand.level],
        backgroundColor: [
          '#10b981', // Green for filled portion
          '#f3f4f6'  // Gray for remaining
        ],
        borderWidth: 0,
        borderRadius: 10
      }
    ]
  }

  // 3. Financial Health Horizontal Bar Chart
  const financialHealthConfig = {
    ...chartOptions,
    indexAxis: 'y',
    plugins: {
      ...chartOptions.plugins,
      title: {
        ...chartOptions.plugins.title,
        text: 'Financial Health Dashboard',
        color: '#1f2937'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const index = context.dataIndex
            const category = data.financialHealth.categories[index]
            const value = context.raw
            const suffix = index === 2 ? '% on-time' : '₹'
            return `${category}: ${value}${suffix}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280'
        }
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    }
  }

  const financialHealthData = {
    labels: data.financialHealth.categories,
    datasets: [
      {
        label: 'Your Spending',
        data: data.financialHealth.yourSpending,
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',  // Purple for Electricity
          'rgba(6, 182, 212, 0.8)',   // Cyan for Mobile
          'rgba(16, 185, 129, 0.8)'   // Green for Bill Payments
        ],
        borderColor: [
          '#8b5cf6',
          '#06b6d4', 
          '#10b981'
        ],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 35
      }
    ]
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Financial Trends</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Score History Line Chart */}
        <div className="lg:col-span-2 xl:col-span-2">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="h-80">
              <Line data={scoreHistoryData} options={scoreHistoryConfig} />
            </div>
          </div>
        </div>

        {/* Risk Band Gauge Chart */}
        <div className="lg:col-span-1 xl:col-span-1">
          <div className="bg-gray-50 rounded-xl p-4 h-80 flex flex-col">
            <div className="flex-1 relative">
              <Doughnut data={riskGaugeData} options={riskGaugeConfig} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-2xl font-bold text-gray-900">
                  {data.riskBand.level}%
                </span>
                <span className="text-sm text-gray-600 text-center mt-2 px-4">
                  {data.riskBand.currentBand}
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {data.riskBand.description}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Health Horizontal Bar Chart */}
        <div className="lg:col-span-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="h-80">
              <Bar data={financialHealthData} options={financialHealthConfig} />
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              {data.financialHealth.categories.map((category, index) => (
                <div key={category} className="bg-white rounded-lg p-3 shadow-sm">
                  <p className="font-semibold text-gray-900">{category}</p>
                  <p className="text-2xl font-bold mt-1" style={{
                    color: index === 0 ? '#8b5cf6' : index === 1 ? '#06b6d4' : '#10b981'
                  }}>
                    {data.financialHealth.yourSpending[index]}
                    {index === 2 ? '%' : '₹'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Healthy: {data.financialHealth.healthyMin[index]}-{data.financialHealth.healthyMax[index]}
                    {index === 2 ? '%' : '₹'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}