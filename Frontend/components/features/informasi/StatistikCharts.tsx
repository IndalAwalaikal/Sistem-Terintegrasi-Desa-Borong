'use client';

import React from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { lightTooltipProps } from '@/lib/utils/chartTooltip';
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { StatistikPenduduk } from '@/types/statistik';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#dc2626', '#8b5cf6', '#ec4899', '#06b6d4'];

interface StatistikChartsProps {
  data: StatistikPenduduk;
}

/**
 * Bagian berisi chart (recharts) — dipisah agar dapat di-lazy-load (dynamic
 * { ssr:false }) sehingga pustaka chart berat tidak ikut bundle pada halaman
 * lain. Diterima sebagai Client Component dan tidak perlu data di SSR.
 */
export const StatistikCharts: React.FC<StatistikChartsProps> = ({ data }) => {
  const { t } = useTranslation();
  const genderData = [
    { name: t('Statistik.lakiLaki'), value: data.lakiLaki },
    { name: t('Statistik.perempuan'), value: data.perempuan },
  ];

  return (
    <React.Fragment>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Bar Chart: Per Dusun */}
        <Card className="lg:col-span-8 p-6">
          <CardHeader className="px-0 pt-0 flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-600" />
              {t('Statistik.perDusun')}
            </h3>
          </CardHeader>
          <CardBody className="px-0 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.perDusun}>
                <XAxis dataKey="dusun" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip {...lightTooltipProps} />
                <Bar dataKey="jumlah" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Pie Chart: Gender */}
        <Card className="lg:col-span-4 p-6">
          <CardHeader className="px-0 pt-0 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-secondary-600" />
              {t('Statistik.komposisiGender')}
            </h3>
          </CardHeader>
          <CardBody className="px-0 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#ec4899" />
                </Pie>
                <Tooltip {...lightTooltipProps} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Chart */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {t('Statistik.pendidikan')}
            </h3>
          </CardHeader>
          <CardBody className="px-0 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.perPendidikan} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={12} />
                <YAxis dataKey="jenjang" type="category" stroke="#888888" fontSize={11} width={130} />
                <Tooltip {...lightTooltipProps} />
                <Bar dataKey="jumlah" fill="#2563eb" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Profession Chart */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0 mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              {t('Statistik.pekerjaan')}
            </h3>
          </CardHeader>
          <CardBody className="px-0 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.perPekerjaan} layout="vertical">
                <XAxis type="number" stroke="#888888" fontSize={12} />
                <YAxis dataKey="pekerjaan" type="category" stroke="#888888" fontSize={11} width={130} />
                <Tooltip {...lightTooltipProps} />
                <Bar dataKey="jumlah" fill="#f59e0b" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 3: Age Groups & Religion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Age Group Chart */}
        {data.perKelompokUsia && data.perKelompokUsia.length > 0 && (
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t('Statistik.kelompokUsia')}
              </h3>
            </CardHeader>
            <CardBody className="px-0 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.perKelompokUsia}>
                  <XAxis dataKey="rentang" stroke="#888888" fontSize={11} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip {...lightTooltipProps} />
                  <Bar dataKey="jumlah" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}

        {/* Religion Chart */}
        {data.perAgama && data.perAgama.length > 0 && (
          <Card className="p-6">
            <CardHeader className="px-0 pt-0 mb-4">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {t('Statistik.agama')}
              </h3>
            </CardHeader>
            <CardBody className="px-0 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.perAgama.map((item) => ({ name: item.agama, value: item.jumlah }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? ''}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {data.perAgama.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...lightTooltipProps} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        )}
      </div>
    </React.Fragment>
  );
};
