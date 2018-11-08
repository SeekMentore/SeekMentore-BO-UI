export class FilterOption {
  id: string;
  label: string;
  value: string;
  isSelected: boolean = false; // Do not set in constructor

  constructor(id: string, label: string, value: string) {
    this.id = id;
    this.label = label;
    this.value = value;
  }
}
