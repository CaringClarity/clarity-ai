"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  MessageSquare,
  Tag,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react"
import { GlassSidebar } from "@/components/glass-sidebar"

export default function KnowledgeBasePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showAddArticle, setShowAddArticle] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [editMode, setEditMode] = useState(false)

  // Mock knowledge base data
  const knowledgeArticles = [
    {
      id: "kb_001",
      title: "Office Hours and Location",
      content:
        "Our office is open Monday through Friday from 9:00 AM to 5:00 PM, and Saturday from 10:00 AM to 2:00 PM. We are located at 123 Wellness Drive, Suite 200, in downtown. Parking is available in the adjacent garage with validation.",
      category: "General Information",
      tags: ["hours", "location", "parking"],
      lastUpdated: "2024-01-15T10:30:00Z",
      views: 245,
      useCount: 89,
      status: "published",
      author: "Dr. Sarah Mitchell",
    },
    {
      id: "kb_002",
      title: "Insurance and Payment Options",
      content:
        "We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealth. We also offer sliding scale fees for uninsured patients. Payment can be made by cash, check, or credit card. Co-pays are due at the time of service.",
      category: "Billing",
      tags: ["insurance", "payment", "copay", "sliding scale"],
      lastUpdated: "2024-01-14T14:20:00Z",
      views: 189,
      useCount: 67,
      status: "published",
      author: "Lisa Thompson",
    },
    {
      id: "kb_003",
      title: "Emergency and Crisis Support",
      content:
        "If you are experiencing a mental health emergency, please call 911 or go to your nearest emergency room. For crisis support, you can call the National Suicide Prevention Lifeline at 988 or text HOME to 741741 for the Crisis Text Line. Our office has a 24/7 crisis line at (555) 123-HELP.",
      category: "Emergency",
      tags: ["emergency", "crisis", "suicide prevention", "24/7"],
      lastUpdated: "2024-01-13T16:45:00Z",
      views: 156,
      useCount: 23,
      status: "published",
      author: "Dr. Emily Rodriguez",
    },
    {
      id: "kb_004",
      title: "Appointment Scheduling and Cancellation",
      content:
        "Appointments can be scheduled by calling our office, using our online portal, or through our AI assistant. We require 24-hour notice for cancellations to avoid a cancellation fee. Same-day appointments may be available for urgent needs.",
      category: "Appointments",
      tags: ["scheduling", "cancellation", "online portal", "same-day"],
      lastUpdated: "2024-01-12T11:15:00Z",
      views: 298,
      useCount: 134,
      status: "published",
      author: "Maria Garcia",
    },
    {
      id: "kb_005",
      title: "Therapy Services and Specializations",
      content:
        "We offer individual therapy, couples counseling, family therapy, and group sessions. Our specializations include anxiety, depression, trauma, addiction recovery, and relationship counseling. All therapists are licensed and have specialized training in evidence-based practices.",
      category: "Services",
      tags: ["therapy", "counseling", "specializations", "licensed"],
      lastUpdated: "2024-01-11T09:30:00Z",
      views: 267,
      useCount: 98,
      status: "published",
      author: "Dr. Emily Rodriguez",
    },
    {
      id: "kb_006",
      title: "Telehealth and Virtual Sessions",
      content:
        "We offer secure telehealth sessions through our HIPAA-compliant platform. Virtual sessions are available for individual therapy and some group sessions. You'll receive a secure link via email 15 minutes before your appointment. Technical support is available if needed.",
      category: "Services",
      tags: ["telehealth", "virtual", "HIPAA", "technical support"],
      lastUpdated: "2024-01-10T13:45:00Z",
      views: 178,
      useCount: 45,
      status: "draft",
      author: "James Wilson",
    },
  ]

  const categories = [
    { value: "General Information", label: "General Information", color: "bg-soft-blue text-white" },
    { value: "Billing", label: "Billing", color: "bg-soft-purple text-white" },
    { value: "Emergency", label: "Emergency", color: "bg-red-500 text-white" },
    { value: "Appointments", label: "Appointments", color: "bg-soft-mint text-gray-700" },
    { value: "Services", label: "Services", color: "bg-soft-peach text-gray-700" },
  ]

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getCategoryColor = (category) => {
    const categoryConfig = categories.find((c) => c.value === category)
    return categoryConfig ? categoryConfig.color : "bg-gray-200 text-gray-600"
  }

  const getStatusColor = (status) => {
    return status === "published" ? "bg-soft-mint text-gray-700" : "bg-soft-peach text-gray-700"
  }

  const filteredArticles = knowledgeArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === "all" || article.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <GlassSidebar userRole="tenant-admin" userName="Dr. Sarah Mitchell">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Knowledge Base</h1>
            <p className="text-gray-600 text-lg">Manage AI agent responses and FAQ content</p>
          </div>
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button
              onClick={() => setShowAddArticle(true)}
              className="bg-gradient-to-r from-soft-blue to-soft-purple text-white hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Article
            </Button>
          </div>
        </div>

        {/* Knowledge Base Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              title: "Total Articles",
              value: knowledgeArticles.length,
              change: "+3 this week",
              icon: BookOpen,
              color: "from-soft-blue to-soft-purple",
            },
            {
              title: "Published",
              value: knowledgeArticles.filter((a) => a.status === "published").length,
              change: "Live content",
              icon: Eye,
              color: "from-soft-mint to-soft-peach",
            },
            {
              title: "Total Views",
              value: knowledgeArticles.reduce((sum, a) => sum + a.views, 0),
              change: "+15% this month",
              icon: TrendingUp,
              color: "from-soft-purple to-soft-pink",
            },
            {
              title: "AI Usage",
              value: knowledgeArticles.reduce((sum, a) => sum + a.useCount, 0),
              change: "Times referenced",
              icon: MessageSquare,
              color: "from-soft-peach to-soft-lavender",
            },
          ].map((stat, index) => (
            <Card
              key={stat.title}
              className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                    <p className="text-xs text-green-600">{stat.change}</p>
                  </div>
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search articles, content, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>

              {/* Category Filter */}
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-64 bg-white/50 border-white/20">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Articles */}
        <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Knowledge Articles</CardTitle>
            <CardDescription className="text-gray-600">{filteredArticles.length} articles found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-start justify-between p-6 rounded-2xl bg-white/30 hover:bg-white/50 transition-all duration-200 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="flex-1">
                    {/* Article Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{article.title}</h3>
                      <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                      <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                    </div>

                    {/* Article Content Preview */}
                    <p className="text-gray-600 mb-3 line-clamp-2">{article.content.substring(0, 150)}...</p>

                    {/* Tags */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="w-3 h-3 text-gray-400" />
                      {article.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-white/50 px-2 py-1 rounded-lg text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Article Meta */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Updated {formatDate(article.lastUpdated)}
                      </span>
                      <span>By {article.author}</span>
                      <span>{article.views} views</span>
                      <span>{article.useCount} AI uses</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30">
                      <Eye className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 hover:bg-white/30 text-red-600">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Article Modal */}
        {(showAddArticle || selectedArticle) && (
          <Card className="bg-white/50 backdrop-blur-xl border-white/20 shadow-xl animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-800">
                  {showAddArticle ? "Add New Article" : selectedArticle?.title}
                </CardTitle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAddArticle(false)
                    setSelectedArticle(null)
                    setEditMode(false)
                  }}
                  className="hover:bg-white/30"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {showAddArticle || editMode ? (
                // Edit Form
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Article Title</label>
                      <Input
                        className="bg-white/50 border-white/20"
                        placeholder="Enter article title"
                        defaultValue={selectedArticle?.title || ""}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                      <Select defaultValue={selectedArticle?.category || ""}>
                        <SelectTrigger className="bg-white/50 border-white/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
                    <Textarea
                      className="bg-white/50 border-white/20 min-h-[200px]"
                      placeholder="Enter article content..."
                      defaultValue={selectedArticle?.content || ""}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Tags</label>
                    <Input
                      className="bg-white/50 border-white/20"
                      placeholder="Enter tags separated by commas"
                      defaultValue={selectedArticle?.tags?.join(", ") || ""}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <Button className="bg-gradient-to-r from-soft-blue to-soft-purple text-white">
                      <Save className="w-4 h-4 mr-2" />
                      {showAddArticle ? "Create Article" : "Save Changes"}
                    </Button>
                    <Button variant="outline" className="border-white/20 hover:bg-white/30">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddArticle(false)
                        setSelectedArticle(null)
                        setEditMode(false)
                      }}
                      className="border-white/20 hover:bg-white/30"
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                // View Mode
                selectedArticle && (
                  <>
                    <div className="flex items-center space-x-3 mb-4">
                      <Badge className={getCategoryColor(selectedArticle.category)}>{selectedArticle.category}</Badge>
                      <Badge className={getStatusColor(selectedArticle.status)}>{selectedArticle.status}</Badge>
                      <span className="text-sm text-gray-500">
                        Last updated {formatDate(selectedArticle.lastUpdated)} by {selectedArticle.author}
                      </span>
                    </div>

                    <div className="bg-white/30 p-6 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{selectedArticle.content}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        {selectedArticle.tags.map((tag) => (
                          <span key={tag} className="text-sm bg-white/50 px-3 py-1 rounded-lg text-gray-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button
                        onClick={() => setEditMode(true)}
                        className="bg-gradient-to-r from-soft-blue to-soft-purple text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Article
                      </Button>
                      <Button variant="outline" className="border-white/20 hover:bg-white/30">
                        <FileText className="w-4 h-4 mr-2" />
                        Duplicate
                      </Button>
                    </div>
                  </>
                )
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </GlassSidebar>
  )
}
