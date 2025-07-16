import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const DataTable = ({ 
  data = [], 
  columns = [], 
  onRowClick,
  onSort,
  sortable = true,
  className,
  ...props 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    if (!sortable) return;
    
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    
    setSortConfig({ key, direction });
    if (onSort) {
      onSort(key, direction);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return "ArrowUpDown";
    return sortConfig.direction === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return (
    <div className={cn("overflow-x-auto", className)} {...props}>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  sortable && "cursor-pointer hover:bg-gray-100"
                )}
                onClick={() => sortable && handleSort(column.key)}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {sortable && (
                    <ApperIcon 
                      name={getSortIcon(column.key)} 
                      className="w-4 h-4 text-gray-400" 
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr 
              key={row.id || index}
              className={cn(
                "hover:bg-gray-50 transition-colors duration-150",
                onRowClick && "cursor-pointer"
              )}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  );
};

export default DataTable;