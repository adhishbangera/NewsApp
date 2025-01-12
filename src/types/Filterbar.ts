import { Filter } from "./Filter";

export interface FilterBarProps {
  onFilterChange: (filterType: string, value: string) => void;
  personalized:boolean;
  onSearch:(query:string)=>void;
  setIsPersonalized:React.Dispatch<React.SetStateAction<boolean>>;
  filters:Filter;
  setShowPersonalizeSection:React.Dispatch<React.SetStateAction<boolean>>
}