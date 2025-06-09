"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, ExternalLink, FileIcon, X, Type, Hash, Image, ListFilter } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from 'date-fns';

interface EditRecordFormProps {
  columns: any[];
  initialData?: any;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}


export function formatDate(dateString: string): string {
    try {
      if (!dateString) return '';
      const date = parseISO(dateString);
      return format(date, 'PPP p'); // Feb 10, 2021, 10:45 AM
    } catch (error) {
      return dateString;
    }
  }

export function AppTableDialogForm({ columns, initialData, onSubmit, onCancel }: EditRecordFormProps) {
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
      defaultValues: initialData || {}
    });
    
    const [inputTypes, setInputTypes] = useState<Record<string, string>>({});
    const [dateValues, setDateValues] = useState<Record<string, Date | undefined>>({});
  
    useEffect(() => {
      const types: Record<string, string> = {};
      const dates: Record<string, Date | undefined> = {};
      
      columns.forEach(column => {
        if (column.id !== 'actions' && column.id !== 'select') {
          types[column.id] = column.dataType || 'text';
          
          if (types[column.id] === 'datetime') {
            const value = initialData?.[column.accessorKey];
            if (value) {
              try {
                dates[column.id] = new Date(value);
              } catch (e) {
                console.error("Invalid date:", value);
              }
            }
          }
        }
      });
      
      setInputTypes(types);
      setDateValues(dates);
      
      Object.entries(dates).forEach(([key, value]) => {
        if (value) {
          setValue(key, value.toISOString());
        }
      });
    }, [columns, initialData, setValue]);
  
    const formValues = watch();
  
    const handleTypeChange = (columnId: string, type: string) => {
      setInputTypes(prev => ({ ...prev, [columnId]: type }));
      
      if (type === 'datetime') {
        const now = new Date();
        setDateValues(prev => ({ ...prev, [columnId]: now }));
        setValue(columnId, now.toISOString());
      } else if (type === 'number') {
        setValue(columnId, 0);
      } else if (type === 'file') {
        setValue(columnId, '');
      } else if (type === 'select') {
        const options = columns.find(col => col.id === columnId)?.filterOptions || [];
        if (options.length > 0) {
          setValue(columnId, options[0]);
        } else {
          setValue(columnId, '');
        }
      } else {
        setValue(columnId, '');
      }
    };
  
    const handleDateChange = (columnId: string, date: Date | undefined) => {
      setDateValues(prev => ({ ...prev, [columnId]: date }));
      setValue(columnId, date?.toISOString() || '');
    };
  
    const isValidUrl = (string: string): boolean => {
      try {
        new URL(string);
        return true;
      } catch (_) {
        return false;
      }
    };
  
    const isImageUrl = (url: string): boolean => {
      return isValidUrl(url) && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
    };
  
    const getTypeIcon = (type: string) => {
      switch (type) {
        case 'text':
          return <Type className="h-4 w-4" />;
        case 'number':
          return <Hash className="h-4 w-4" />;
        case 'file':
          return <Image className="h-4 w-4" />;
        case 'datetime':
          return <CalendarIcon className="h-4 w-4" />;
        case 'select':
          return <ListFilter className="h-4 w-4" />;
        default:
          return <Type className="h-4 w-4" />;
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {columns
            .filter(column => column.id !== 'actions' && column.id !== 'select')
            .map((column) => {
              const currentType = column.dataType || inputTypes[column.id] || 'text';
              
              return (
                <div key={column.id} className="space-y-2">
                  <Label htmlFor={column.id} className="text-sm font-medium">
                    {column.header}
                  </Label>
                  
                  <div className="grid gap-2">
                    {!column.dataType && (
                      <div className="relative w-full">
                        {currentType === 'text' && (
                          <Input
                            id={column.id}
                            {...register(column.accessorKey, { required: true })}
                            className={cn(
                              "pr-9",
                              errors[column.accessorKey] ? "border-destructive" : ""
                            )}
                          />
                        )}
                        
                        {currentType === 'number' && (
                          <Input
                            id={column.id}
                            type="number"
                            {...register(column.accessorKey, { 
                              required: true,
                              valueAsNumber: true 
                            })}
                            className={cn(
                              "pr-9",
                              errors[column.accessorKey] ? "border-destructive" : ""
                            )}
                          />
                        )}
                        
                        {currentType === 'file' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <Input
                                  id={column.id}
                                  placeholder="Enter URL"
                                  {...register(column.accessorKey, { 
                                    required: true,
                                    validate: value => isValidUrl(value) || "Please enter a valid URL"
                                  })}
                                  className={cn(
                                    "pr-9",
                                    errors[column.accessorKey] ? "border-destructive" : ""
                                  )}
                                />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                    >
                                      {getTypeIcon(currentType)}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                      <Type className="mr-2 h-4 w-4" /> Text
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                      <Hash className="mr-2 h-4 w-4" /> Number
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                      <Image className="mr-2 h-4 w-4" /> File URL
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                      <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                                    </DropdownMenuItem>
                                    {column.filterOptions && (
                                      <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                        <ListFilter className="mr-2 h-4 w-4" /> Select
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => window.open(formValues[column.accessorKey], '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                              <div className="relative rounded-md border overflow-hidden">
                                {isImageUrl(formValues[column.accessorKey]) ? (
                                  <img 
                                    src={formValues[column.accessorKey]} 
                                    alt="Preview"
                                    className="w-full h-24 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-24 bg-muted/30 flex items-center justify-center">
                                    <FileIcon className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
                                  onClick={() => setValue(column.accessorKey, '')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {currentType === 'datetime' && (
                          <div className="relative">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal pr-9",
                                    !dateValues[column.id] && "text-muted-foreground",
                                    errors[column.accessorKey] ? "border-destructive" : ""
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateValues[column.id] ? (
                                    formatDate(dateValues[column.id]?.toISOString() || '')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateValues[column.id]}
                                  onSelect={(date) => handleDateChange(column.id, date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <input
                              type="hidden"
                              id={column.id}
                              {...register(column.accessorKey, { required: true })}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                >
                                  {getTypeIcon(currentType)}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                  <Type className="mr-2 h-4 w-4" /> Text
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                  <Hash className="mr-2 h-4 w-4" /> Number
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                  <Image className="mr-2 h-4 w-4" /> File URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                  <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                                </DropdownMenuItem>
                                {column.filterOptions && (
                                  <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                    <ListFilter className="mr-2 h-4 w-4" /> Select
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                        
                        {currentType === 'select' && column.filterOptions && (
                          <div className="relative">
                            <Select
                              value={formValues[column.accessorKey] || ''}
                              onValueChange={(value) => setValue(column.accessorKey, value)}
                            >
                              <SelectTrigger className={cn(
                                "pr-9",
                                errors[column.accessorKey] ? "border-destructive" : ""
                              )}>
                                <SelectValue placeholder="Select an option" />
                              </SelectTrigger>
                              <SelectContent>
                                {column.filterOptions.map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                >
                                  {getTypeIcon(currentType)}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                  <Type className="mr-2 h-4 w-4" /> Text
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                  <Hash className="mr-2 h-4 w-4" /> Number
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                  <Image className="mr-2 h-4 w-4" /> File URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                  <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                                </DropdownMenuItem>
                                {column.filterOptions && (
                                  <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                    <ListFilter className="mr-2 h-4 w-4" /> Select
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                        
                        {!['file', 'datetime', 'select'].includes(currentType) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                              >
                                {getTypeIcon(currentType)}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'text')}>
                                <Type className="mr-2 h-4 w-4" /> Text
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'number')}>
                                <Hash className="mr-2 h-4 w-4" /> Number
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'file')}>
                                <Image className="mr-2 h-4 w-4" /> File URL
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'datetime')}>
                                <CalendarIcon className="mr-2 h-4 w-4" /> Date & Time
                              </DropdownMenuItem>
                              {column.filterOptions && (
                                <DropdownMenuItem onClick={() => handleTypeChange(column.id, 'select')}>
                                  <ListFilter className="mr-2 h-4 w-4" /> Select
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )}
                    
                    {column.dataType && (
                      <>
                        {column.dataType === 'text' && (
                          <Input
                            id={column.id}
                            {...register(column.accessorKey, { required: true })}
                            className={errors[column.accessorKey] ? "border-destructive" : ""}
                          />
                        )}
                        
                        {column.dataType === 'number' && (
                          <Input
                            id={column.id}
                            type="number"
                            {...register(column.accessorKey, { 
                              required: true,
                              valueAsNumber: true 
                            })}
                            className={errors[column.accessorKey] ? "border-destructive" : ""}
                          />
                        )}
                        
                        {column.dataType === 'file' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                id={column.id}
                                placeholder="Enter URL"
                                {...register(column.accessorKey, { 
                                  required: true,
                                  validate: value => isValidUrl(value) || "Please enter a valid URL"
                                })}
                                className={cn(
                                  "flex-1",
                                  errors[column.accessorKey] ? "border-destructive" : ""
                                )}
                              />
                              {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => window.open(formValues[column.accessorKey], '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            {formValues[column.accessorKey] && isValidUrl(formValues[column.accessorKey]) && (
                              <div className="relative rounded-md border overflow-hidden">
                                {isImageUrl(formValues[column.accessorKey]) ? (
                                  <img 
                                    src={formValues[column.accessorKey]} 
                                    alt="Preview"
                                    className="w-full h-24 object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-24 bg-muted/30 flex items-center justify-center">
                                    <FileIcon className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full bg-background/80"
                                  onClick={() => setValue(column.accessorKey, '')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {column.dataType === 'datetime' && (
                          <div>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !dateValues[column.id] && "text-muted-foreground",
                                    errors[column.accessorKey] ? "border-destructive" : ""
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateValues[column.id] ? (
                                    formatDate(dateValues[column.id]?.toISOString() || '')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateValues[column.id]}
                                  onSelect={(date) => handleDateChange(column.id, date)}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <input
                              type="hidden"
                              id={column.id}
                              {...register(column.accessorKey, { required: true })}
                            />
                          </div>
                        )}
                        
                        {column.dataType === 'select' && column.filterOptions && (
                          <Select
                            value={formValues[column.accessorKey] || ''}
                            onValueChange={(value) => setValue(column.accessorKey, value)}
                          >
                            <SelectTrigger className={cn(
                              errors[column.accessorKey] ? "border-destructive" : ""
                            )}>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              {column.filterOptions.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                    
                    {errors[column.accessorKey] && (
                      <p className="text-xs text-destructive">
                        This field is required
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Add'} Record
          </Button>
        </DialogFooter>
      </form>
    );
}