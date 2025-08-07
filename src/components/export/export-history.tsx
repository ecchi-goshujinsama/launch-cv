'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Clock, FileText, Download, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useExportStore } from '../../lib/stores/export-store';
import { formatDistanceToNow } from 'date-fns';

interface ExportHistoryProps {
  resumeId?: string;
  limit?: number;
}

export const ExportHistory: React.FC<ExportHistoryProps> = ({ resumeId, limit = 10 }) => {
  const { 
    history, 
    removeExportEntry, 
    clearHistory,
    getExportsByResumeId,
    getRecentExports,
  } = useExportStore();

  const exports = resumeId 
    ? getExportsByResumeId(resumeId) 
    : getRecentExports(limit);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const getStatusIcon = (success: boolean) => {
    return success 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? 'default' : 'destructive'} className="text-xs">
        {success ? 'Success' : 'Failed'}
      </Badge>
    );
  };

  if (exports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Export History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No export history yet</p>
            <p className="text-sm">Your exported resumes will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Export History
            <Badge variant="outline" className="ml-2">
              {exports.length}
            </Badge>
          </CardTitle>
          {exports.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {exports.map((exportEntry) => (
            <div
              key={exportEntry.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  {getStatusIcon(exportEntry.success)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {exportEntry.resumeTitle}
                    </h4>
                    {getStatusBadge(exportEntry.success)}
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex items-center gap-4">
                      <span>Template: {exportEntry.templateName}</span>
                      {exportEntry.fileSize && (
                        <span>Size: {formatFileSize(exportEntry.fileSize)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>
                        {formatDistanceToNow(new Date(exportEntry.exportedAt), { addSuffix: true })}
                      </span>
                    </div>
                    {exportEntry.error && (
                      <div className="text-red-500 text-xs mt-1">
                        Error: {exportEntry.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExportEntry(exportEntry.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-launch-blue">
                {exports.length}
              </div>
              <div className="text-xs text-gray-500">Total Exports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">
                {exports.filter(e => e.success).length}
              </div>
              <div className="text-xs text-gray-500">Successful</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">
                {exports.filter(e => !e.success).length}
              </div>
              <div className="text-xs text-gray-500">Failed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};