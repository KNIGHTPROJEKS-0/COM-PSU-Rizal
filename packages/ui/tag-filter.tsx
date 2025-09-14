"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, X, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useTags } from "@/hooks/use-tags"
import { useUIStore } from "@/lib/store/ui-store"
import { useTaskStore } from "@/lib/store/task-store"

export default function TagFilter() {
  const tasks = useTaskStore((state) => state.tasks)
  const selectedTags = useUIStore((state) => state.selectedTags)
  const toggleTag = useUIStore((state) => state.toggleTag)
  const clearSelectedTags = useUIStore((state) => state.clearSelectedTags)

  const [isOpen, setIsOpen] = useState(false)
  const [tagFilter, setTagFilter] = useState("")

  const { allTags, tagCounts } = useTags(tasks)

  // Filter tags based on search input
  const filteredTags = allTags.filter((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))

  if (allTags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Tag className="h-3.5 w-3.5" />
            Filter by tag
            {selectedTags.length > 0 && (
              <Badge variant="secondary" className="ml-1 px-1 py-0 h-5">
                {selectedTags.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0" align="start">
          <div className="p-2 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filter by tags</h4>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clearSelectedTags}>
                  Clear all
                </Button>
              )}
            </div>
          </div>

          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <ScrollArea className="h-[300px] p-2">
            {filteredTags.length > 0 ? (
              <div className="space-y-2">
                {filteredTags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTag(tag)}
                    />
                    <Label htmlFor={`tag-${tag}`} className="flex-1 text-sm cursor-pointer">
                      {tag}
                      <span className="ml-1 text-muted-foreground">({tagCounts[tag]})</span>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[100px] text-muted-foreground">No tags found</div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 items-center">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="px-2 py-0 h-7 gap-1 animate-fadeIn">
              {tag}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => toggleTag(tag)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {tag}</span>
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={clearSelectedTags}>
            Clear
          </Button>
        </div>
      )}
    </div>
  )
}
