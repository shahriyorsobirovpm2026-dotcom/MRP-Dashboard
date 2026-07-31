import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Package, DollarSign, Warehouse, TrendingUp, Truck,
  FileText, ChevronRight, AlertCircle, CheckCircle, Clock,
  ChevronLeft, ChevronRight as ChevronRightIcon, Menu, X, AlertTriangle
} from 'lucide-react';

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState('sku-overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [bomFilter, setBomFilter] = useState('all');

  // ===== BASELINE DATA =====
  const businessData = {
    totalSKUs: 1248,
    inStock: 1120,
    lowStock: 94,
    outOfStock: 34,
    totalInventoryValue: 482350,
    dailyInflow: 18450,
    dailyOutflow: 12200,
    monthlyRevenue: 553500,
    monthlyCOGS: 310000,
    monthlyOpEx: 56000,
    warehouses: [
      { name: 'Main Logistics Hub', capacity: 82, units: 5850 },
      { name: 'Central Warehouse', capacity: 65, units: 4680 },
      { name: 'Express Depot', capacity: 91, units: 3720 }
    ],
    categories: [
      { name: 'Laptops', skus: 410, value: 245000 },
      { name: 'Accessories', skus: 380, value: 42000 },
      { name: 'Monitors', skus: 210, value: 98000 },
      { name: 'Desktops', skus: 148, value: 72000 },
      { name: 'Networking', skus: 100, value: 25000 }
    ],
    mrp: {
      activeOrders: 8,
      plannedAssemblies: 12,
      componentShortages: 3,
      bomReadiness: 96.4
    },
    zapovka: {
      activePOs: 14,
      valueInTransit: 84200,
      avgLeadTime: 8.4,
      supplierReliability: 94.2
    }
  };

  // ===== GENERATE MOCK DATA =====
  const generateDailyCashFlow = () => {
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const inflow = 18450 + (Math.random() - 0.5) * 4000;
      const outflow = 12200 + (Math.random() - 0.5) * 3000;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        net: Math.round(inflow - outflow)
      });
    }
    return data;
  };

  const generateMonthlyCashFlow = () => {
    return [
      { month: 'Jun', revenue: 485000, expenses: 320000 },
      { month: 'Jul', revenue: 510000, expenses: 345000 },
      { month: 'Aug', revenue: 495000, expenses: 330000 },
      { month: 'Sep', revenue: 540000, expenses: 365000 },
      { month: 'Oct', revenue: 553500, expenses: 366000 }
    ];
  };

  const generateStockAllocation = () => {
    const skus = ['LT-001', 'DT-045', 'MN-089', 'AC-234', 'NW-567', 'LT-002', 'AC-235', 'MN-090'];
    const locations = ['Main Logistics Hub', 'Central Warehouse', 'Express Depot'];
    const items = [
      'Dell XPS 13', 'HP Pavilion Desktop', 'LG 4K Monitor', 'USB-C Cable', 'Wifi Router',
      'MacBook Pro', 'HDMI Cable', 'Dell Monitor'
    ];
    
    return skus.map((sku, idx) => ({
      skuCode: sku,
      itemName: items[idx],
      location: locations[idx % 3],
      onHand: Math.floor(Math.random() * 500) + 50,
      allocated: Math.floor(Math.random() * 100) + 10,
      reorderPoint: 25,
      status: Math.random() > 0.7 ? 'Low Stock' : 'In Stock'
    }));
  };

  const generateBomData = () => {
    return [
      { assembly: 'Assembly A-001', component: 'Circuit Board v2', stock: 45, required: 120, shortage: -75, leadTime: 5, status: 'Shortage Alert' },
      { assembly: 'Assembly A-001', component: 'Power Supply 500W', stock: 80, required: 120, shortage: -40, leadTime: 3, status: 'Shortage Alert' },
      { assembly: 'Assembly A-002', component: 'Casing Plastic', stock: 200, required: 150, shortage: 50, leadTime: 2, status: 'Ready for Production' },
      { assembly: 'Assembly A-003', component: 'LED Display', stock: 65, required: 100, shortage: -35, leadTime: 7, status: 'Shortage Alert' },
      { assembly: 'Assembly B-001', component: 'Motherboard', stock: 120, required: 120, shortage: 0, leadTime: 4, status: 'Ready for Production' },
      { assembly: 'Assembly B-002', component: 'RAM Module 16GB', stock: 180, required: 200, shortage: -20, leadTime: 2, status: 'Pending Procurement' },
      { assembly: 'Assembly C-001', component: 'Cooling Fan', stock: 300, required: 150, shortage: 150, leadTime: 1, status: 'Ready for Production' },
      { assembly: 'Assembly C-002', component: 'Thermal Paste', stock: 15, required: 100, shortage: -85, leadTime: 6, status: 'Critical Shortage' }
    ];
  };

  const generateProductionSchedule = () => {
    return [
      { week: 'Week 1', capacity: 78, allocated: 92 },
      { week: 'Week 2', capacity: 78, allocated: 85 },
      { week: 'Week 3', capacity: 78, allocated: 71 },
      { week: 'Week 4', capacity: 78, allocated: 88 }
    ];
  };

  const generateRestockPipeline = () => {
    return [
      { stage: 'Orders Placed', count: 4 },
      { stage: 'In Transit', count: 6 },
      { stage: 'Customs/Inspection', count: 3 },
      { stage: 'Ready for Receiving', count: 1 }
    ];
  };

  const generateSupplierOrders = () => {
    const suppliers = ['TechCore International', 'Global Hardware Co', 'Asia Tech Supply', 'Direct Tech Import'];
    const skus = ['LT-001', 'DT-045', 'MN-089', 'AC-234', 'NW-567', 'LT-002', 'AC-235', 'MN-090'];
    const statuses = ['Pending', 'In Transit', 'Arrived'];
    
    return skus.map((sku, idx) => ({
      id: `PO-${2024001 + idx}`,
      supplier: suppliers[idx % 4],
      sku: sku,
      quantity: Math.floor(Math.random() * 200) + 50,
      eta: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: statuses[Math.floor(Math.random() * 3)]
    }));
  };

  const generateTransactions = () => {
    const transactions = [];
    const skus = ['LT-001', 'DT-045', 'MN-089', 'AC-234', 'NW-567', 'LT-002', 'AC-235', 'MN-090', 'LT-003', 'AC-236'];
    const types = ['Sales Outflow', 'Stock Inflow', 'MRP Transfer', 'Adjustment'];
    const warehouses = ['Main Logistics Hub', 'Central Warehouse', 'Express Depot'];
    const statuses = ['Completed', 'Pending', 'Flagged'];

    for (let i = 0; i < 1000; i++) {
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = type === 'Sales Outflow' 
        ? -(Math.floor(Math.random() * 5000) + 100)
        : type === 'Stock Inflow'
        ? (Math.floor(Math.random() * 10000) + 500)
        : type === 'MRP Transfer'
        ? (Math.floor(Math.random() * 3000) + 200)
        : (Math.floor(Math.random() * 1000) + 50);

      transactions.push({
        id: `TXN-${1000000 + i}`,
        timestamp: timestamp.toLocaleString(),
        sku: skus[Math.floor(Math.random() * skus.length)],
        type: type,
        amount: amount,
        location: warehouses[Math.floor(Math.random() * warehouses.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    return transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const generateLowStockAlerts = () => {
    return [
      { sku: 'AC-234', name: 'USB-C Cable (Bulk)', onHand: 8, reorderLevel: 25, status: 'Critical' },
      { sku: 'NW-567', name: 'Wifi Router 6E', onHand: 4, reorderLevel: 15, status: 'Critical' },
      { sku: 'AC-235', name: 'HDMI Cable', onHand: 12, reorderLevel: 30, status: 'Warning' },
      { sku: 'LT-002', name: 'Laptop Stand', onHand: 9, reorderLevel: 20, status: 'Critical' },
      { sku: 'MN-089', name: '27 Inch Monitor Arm', onHand: 6, reorderLevel: 10, status: 'Critical' }
    ];
  };

  // ===== MEMOIZED DATA =====
  const dailyCashFlow = useMemo(() => generateDailyCashFlow(), []);
  const monthlyCashFlow = useMemo(() => generateMonthlyCashFlow(), []);
  const stockAllocation = useMemo(() => generateStockAllocation(), []);
  const bomData = useMemo(() => generateBomData(), []);
  const productionSchedule = useMemo(() => generateProductionSchedule(), []);
  const restockPipeline = useMemo(() => generateRestockPipeline(), []);
  const supplierOrders = useMemo(() => generateSupplierOrders(), []);
  const allTransactions = useMemo(() => generateTransactions(), []);
  const lowStockAlerts = useMemo(() => generateLowStockAlerts(), []);

  // ===== FILTERED DATA =====
  const filteredStockAllocation = useMemo(() => {
    if (warehouseFilter === 'all') return stockAllocation;
    return stockAllocation.filter(s => s.location === warehouseFilter);
  }, [warehouseFilter]);

  const filteredBOM = useMemo(() => {
    if (bomFilter === 'all') return bomData;
    return bomData.filter(b => b.status === bomFilter);
  }, [bomFilter]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const matchesSearch = t.id.includes(transactionSearch) || t.sku.includes(transactionSearch);
      const matchesFilter = transactionFilter === 'all' || t.type === transactionFilter || t.status === transactionFilter;
      return matchesSearch && matchesFilter;
    });
  }, [transactionSearch, transactionFilter]);

  const paginatedTransactions = filteredTransactions.slice(
    (transactionPage - 1) * 10,
    transactionPage * 10
  );
  const totalPages = Math.ceil(filteredTransactions.length / 10);

  // ===== FINANCIAL CALCULATIONS =====
  const grossProfit = businessData.monthlyRevenue - businessData.monthlyCOGS;
  const netProfit = grossProfit - businessData.monthlyOpEx;
  const profitMargin = ((netProfit / businessData.monthlyRevenue) * 100).toFixed(1);
  const roi = ((netProfit / businessData.totalInventoryValue) * 100 * 12).toFixed(1);
  const inventoryTurnover = (businessData.monthlyCOGS * 12 / businessData.totalInventoryValue).toFixed(1);
  const daysInventory = (365 / inventoryTurnover).toFixed(0);

  // ===== COMPONENTS =====
  const StatCard = ({ icon: Icon, label, value, subtext, color = 'blue' }) => {
    const colorClass = {
      green: 'bg-green-50 text-green-700 border-green-200',
      red: 'bg-red-50 text-red-700 border-red-200',
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      amber: 'bg-amber-50 text-amber-700 border-amber-200'
    }[color];

    return (
      <div className={`${colorClass} border rounded-lg p-4`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtext && <p className="text-xs opacity-60 mt-1">{subtext}</p>}
          </div>
          <Icon className="w-6 h-6 opacity-40" />
        </div>
      </div>
    );
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      'In Stock': 'bg-green-100 text-green-800',
      'Low Stock': 'bg-amber-100 text-amber-800',
      'Out of Stock': 'bg-red-100 text-red-800',
      'Completed': 'bg-green-100 text-green-800',
      'Pending': 'bg-amber-100 text-amber-800',
      'Flagged': 'bg-red-100 text-red-800',
      'Arrived': 'bg-green-100 text-green-800',
      'In Transit': 'bg-blue-100 text-blue-800',
      'Critical': 'bg-red-100 text-red-800',
      'Warning': 'bg-amber-100 text-amber-800',
      'Ready for Production': 'bg-green-100 text-green-800',
      'Shortage Alert': 'bg-red-100 text-red-800',
      'Pending Procurement': 'bg-amber-100 text-amber-800',
      'Critical Shortage': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  // ===== PAGES =====
  const SKUOverviewPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total SKUs Active" value={businessData.totalSKUs.toLocaleString()} color="blue" />
        <StatCard icon={Package} label="In Stock" value={businessData.inStock.toLocaleString()} color="green" />
        <StatCard icon={AlertCircle} label="Low Stock" value={businessData.lowStock} color="amber" />
        <StatCard icon={AlertTriangle} label="Out of Stock" value={businessData.outOfStock} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Category Value Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={businessData.categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {businessData.categories.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Categories by Value</h3>
          <div className="space-y-3">
            {businessData.categories.map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-900">${(cat.value / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(cat.value / 245000) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alerts (Top 5)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">On Hand</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reorder Level</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockAlerts.map((alert, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-900">{alert.sku}</td>
                  <td className="px-4 py-3 text-gray-700">{alert.name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{alert.onHand}</td>
                  <td className="px-4 py-3 text-gray-700">{alert.reorderLevel}</td>
                  <td className="px-4 py-3"><StatusBadge status={alert.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const MRPPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Active Assembly Orders" value={businessData.mrp.activeOrders} color="blue" />
        <StatCard icon={Package} label="Planned Build Runs" value={businessData.mrp.plannedAssemblies} color="blue" />
        <StatCard icon={AlertTriangle} label="Component Shortages" value={businessData.mrp.componentShortages} color="red" />
        <StatCard icon={CheckCircle} label="BOM Readiness" value={`${businessData.mrp.bomReadiness}%`} color="green" />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Production Schedule Capacity Allocation (4 Weeks)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={productionSchedule}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="capacity" fill="#10B981" name="Available Capacity" />
            <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Bill of Materials and Component Demand</h3>
          <select
            value={bomFilter}
            onChange={(e) => setBomFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="all">All Status</option>
            <option value="Ready for Production">Ready for Production</option>
            <option value="Shortage Alert">Shortage Alert</option>
            <option value="Pending Procurement">Pending Procurement</option>
            <option value="Critical Shortage">Critical Shortage</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Assembly Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Component</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Stock on Hand</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Required Qty</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Net Shortage</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Lead Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Readiness Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBOM.map((bom, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{bom.assembly}</td>
                  <td className="px-4 py-3 text-gray-700">{bom.component}</td>
                  <td className="px-4 py-3 text-gray-900">{bom.stock}</td>
                  <td className="px-4 py-3 text-gray-900">{bom.required}</td>
                  <td className={`px-4 py-3 font-semibold ${bom.shortage < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {bom.shortage < 0 ? bom.shortage : '+' + bom.shortage}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{bom.leadTime} days</td>
                  <td className="px-4 py-3"><StatusBadge status={bom.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const StockValuePage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Capital in Inventory" value={`$${(businessData.totalInventoryValue / 1000).toFixed(0)}k`} color="blue" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value={`$${(businessData.monthlyRevenue / 1000).toFixed(0)}k`} color="green" />
        <StatCard icon={TrendingUp} label="Monthly Expenses" value={`$${((businessData.monthlyCOGS + businessData.monthlyOpEx) / 1000).toFixed(0)}k`} color="amber" />
        <StatCard icon={DollarSign} label="Net Profit" value={`$${(netProfit / 1000).toFixed(0)}k`} color="green" subtext={`${profitMargin}% margin`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Cash Flow (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyCashFlow}>
              <defs>
                <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOutflow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="inflow" stroke="#10B981" fillOpacity={1} fill="url(#colorInflow)" />
              <Area type="monotone" dataKey="outflow" stroke="#EF4444" fillOpacity={1} fill="url(#colorOutflow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Comparison (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCashFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const WarehousePage = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Warehouse Capacity Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {businessData.warehouses.map((wh, idx) => (
            <div key={idx} className="bg-white rounded-lg p-5 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{wh.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{wh.units.toLocaleString()} units</p>
                </div>
                <Warehouse className="w-5 h-5 text-blue-500" />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className={`h-3 rounded-full ${wh.capacity >= 90 ? 'bg-red-500' : wh.capacity >= 75 ? 'bg-amber-500' : 'bg-green-500'}`}
                  style={{ width: `${wh.capacity}%` }}
                ></div>
              </div>
              <p className={`text-sm font-bold ${wh.capacity >= 90 ? 'text-red-600' : wh.capacity >= 75 ? 'text-amber-600' : 'text-green-600'}`}>
                {wh.capacity}% Capacity {wh.capacity >= 90 && '(Alert)'}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">Stock Allocation by Warehouse</h3>
          <select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="all">All Warehouses</option>
            {businessData.warehouses.map((wh, idx) => (
              <option key={idx} value={wh.name}>{wh.name}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU Code</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Item Name</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">On Hand</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Allocated</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Available</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Reorder Point</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStockAllocation.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{item.skuCode}</td>
                  <td className="px-4 py-3 text-gray-700">{item.itemName}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{item.location}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.onHand}</td>
                  <td className="px-4 py-3 text-gray-700">{item.allocated}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{item.onHand - item.allocated}</td>
                  <td className="px-4 py-3 text-gray-700">{item.reorderPoint}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const FinancePage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Gross Revenue" value={`$${(businessData.monthlyRevenue / 1000).toFixed(0)}k`} color="green" />
        <StatCard icon={TrendingUp} label="COGS" value={`-$${(businessData.monthlyCOGS / 1000).toFixed(0)}k`} color="red" />
        <StatCard icon={TrendingUp} label="Gross Profit" value={`$${(grossProfit / 1000).toFixed(0)}k`} color="blue" />
        <StatCard icon={DollarSign} label="Net Profit" value={`$${(netProfit / 1000).toFixed(0)}k`} color="green" subtext={`${profitMargin}% margin`} />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Zero-Based Financial Breakdown</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
            <span className="font-semibold text-green-900">Gross Revenue</span>
            <span className="text-xl font-bold text-green-900">${(businessData.monthlyRevenue / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex justify-center text-gray-400">-</div>
          <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="font-semibold text-red-900">COGS (Raw Materials and Hardware)</span>
            <span className="text-xl font-bold text-red-900">-${(businessData.monthlyCOGS / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex justify-center text-gray-400">=</div>
          <div className="flex justify-between items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <span className="font-semibold text-blue-900">Gross Profit</span>
            <span className="text-xl font-bold text-blue-900">${(grossProfit / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex justify-center text-gray-400">-</div>
          <div className="flex justify-between items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <span className="font-semibold text-amber-900">Operating and Assembly Overhead</span>
            <span className="text-xl font-bold text-amber-900">-${(businessData.monthlyOpEx / 1000).toFixed(0)}k</span>
          </div>
          <div className="flex justify-center text-gray-400">=</div>
          <div className="flex justify-between items-center p-4 bg-green-100 border border-green-300 rounded-lg">
            <span className="font-bold text-green-900 text-lg">Net Operating Margin</span>
            <span className="text-2xl font-bold text-green-900">${(netProfit / 1000).toFixed(0)}k ({profitMargin}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Return on Inventory</p>
          <p className="text-3xl font-bold text-blue-600">{roi}%</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Inventory Turnover Ratio</p>
          <p className="text-3xl font-bold text-blue-600">{inventoryTurnover}x/yr</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Days Sales of Inventory</p>
          <p className="text-3xl font-bold text-blue-600">{daysInventory} days</p>
        </div>
      </div>
    </div>
  );

  const SupplyChainPage = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Truck} label="Active Purchase Orders" value={businessData.zapovka.activePOs} color="blue" />
        <StatCard icon={DollarSign} label="Value in Transit" value={`$${(businessData.zapovka.valueInTransit / 1000).toFixed(0)}k`} color="blue" />
        <StatCard icon={Clock} label="Avg Lead Time" value={`${businessData.zapovka.avgLeadTime} days`} color="blue" />
        <StatCard icon={CheckCircle} label="Supplier Reliability" value={`${businessData.zapovka.supplierReliability}%`} color="green" />
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Restock Pipeline Stages</h3>
        <div className="flex justify-between items-center">
          {restockPipeline.map((stage, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1">
              <div className="bg-blue-100 border-2 border-blue-500 rounded-full w-16 h-16 flex items-center justify-center">
                <p className="text-lg font-bold text-blue-900">{stage.count}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 mt-2 text-center">{stage.stage}</p>
              {idx < restockPipeline.length - 1 && (
                <ChevronRight className="w-6 h-6 text-gray-400 mt-4 -mx-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Supplier and Purchase Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">PO ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Supplier</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Target SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Order Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Estimated Arrival</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {supplierOrders.map((order, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-semibold text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-gray-700 text-sm">{order.supplier}</td>
                  <td className="px-4 py-3 font-mono text-gray-900">{order.sku}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{order.quantity}</td>
                  <td className="px-4 py-3 text-gray-700">{order.eta}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const TransactionPage = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Transaction Engine (1000+ Records)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by ID or SKU..."
            value={transactionSearch}
            onChange={(e) => {
              setTransactionSearch(e.target.value);
              setTransactionPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
            value={transactionFilter}
            onChange={(e) => {
              setTransactionFilter(e.target.value);
              setTransactionPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Types</option>
            <option value="Sales Outflow">Sales Outflow</option>
            <option value="Stock Inflow">Stock Inflow</option>
            <option value="MRP Transfer">MRP Transfer</option>
            <option value="Adjustment">Adjustment</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Flagged">Flagged</option>
          </select>
          <div className="text-right text-sm text-gray-600 py-2">
            {filteredTransactions.length.toLocaleString()} transactions
          </div>
        </div>

        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Transaction ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Timestamp</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-gray-900 font-semibold">{txn.id}</td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{txn.timestamp}</td>
                  <td className="px-4 py-3 font-mono text-gray-900">{txn.sku}</td>
                  <td className="px-4 py-3 text-gray-700">{txn.type}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${txn.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">{txn.location}</td>
                  <td className="px-4 py-3"><StatusBadge status={txn.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {transactionPage} of {totalPages} ({filteredTransactions.length} total)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTransactionPage(Math.max(1, transactionPage - 1))}
              disabled={transactionPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = Math.max(1, transactionPage - 2) + i;
                return pageNum <= totalPages ? (
                  <button
                    key={pageNum}
                    onClick={() => setTransactionPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium ${
                      transactionPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'border border-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ) : null;
              })}
            </div>
            <button
              onClick={() => setTransactionPage(Math.min(totalPages, transactionPage + 1))}
              disabled={transactionPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ===== RENDER =====
  const pages = {
    'sku-overview': { name: 'SKU Overview', component: SKUOverviewPage },
    'mrp': { name: 'MRP and Manufacturing', component: MRPPage },
    'stock-value': { name: 'Stock Value and Cash Flow', component: StockValuePage },
    'warehouse': { name: 'Warehouse and Stock Allocation', component: WarehousePage },
    'finance': { name: 'Finance Dashboard', component: FinancePage },
    'supply-chain': { name: 'Supply Chain and Restock Pipeline', component: SupplyChainPage },
    'transactions': { name: 'Transaction Engine', component: TransactionPage }
  };

  const CurrentPageComponent = pages[currentPage].component;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 border-r border-gray-800 flex flex-col overflow-hidden`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold text-lg">Dashboard</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-800 p-1 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {Object.entries(pages).map(([key, page]) => (
            <button
              key={key}
              onClick={() => setCurrentPage(key)}
              className={`w-full text-left px-4 py-3 border-l-4 transition-colors text-sm ${
                currentPage === key
                  ? 'bg-blue-600 border-blue-400'
                  : 'border-transparent hover:bg-gray-800'
              }`}
            >
              {sidebarOpen ? page.name : key.charAt(0).toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h2 className="text-3xl font-bold text-gray-900">{pages[currentPage].name}</h2>
          <p className="text-gray-600 mt-1">Supply Chain, MRP, Warehouse and Financial Management System</p>
        </div>
        <div className="p-8">
          <CurrentPageComponent />
        </div>
      </div>
    </div>
  );
}
