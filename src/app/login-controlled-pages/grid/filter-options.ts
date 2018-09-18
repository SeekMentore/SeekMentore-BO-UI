export class FilterOptions {
  id: string;
  label: string; // This will show on the popup with checkbox
  value: string; // This will set as the filter value in background
  isSelected = false;

  constructor(id, label, value) {
    this.id = id;
    this.label = label;
    this.value = value;
    // Set values
  }
}
