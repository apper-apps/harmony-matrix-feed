import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search...", 
  className,
  showFilters = false,
  onFilterClick,
  ...props 
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleChange}
          className="pl-10 pr-4 py-2 border-gray-200 focus:border-primary-500 focus:ring-primary-200"
          {...props}
        />
      </div>
      
      {showFilters && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onFilterClick}
          className="px-3 py-2"
        >
          <ApperIcon name="Filter" className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;