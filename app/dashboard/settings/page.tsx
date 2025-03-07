import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Input } from '@/src/components/ui/input'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { Switch } from '@/src/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs'
import { Bell, Key, User, Shield, Mail, Globe, Moon } from 'lucide-react'

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!user) return null

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-6">
                <TabsList className="bg-gray-100/80 p-1">
                    <TabsTrigger value="account" className="text-sm">Account</TabsTrigger>
                    <TabsTrigger value="notifications" className="text-sm">Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="text-sm">Security</TabsTrigger>
                    <TabsTrigger value="appearance" className="text-sm">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="account">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-gray-500" />
                                    <CardTitle>Profile Information</CardTitle>
                                </div>
                                <CardDescription>Update your account profile information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" defaultValue={user.name || ''} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" defaultValue={user.email || ''} />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                                        Save Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-gray-500" />
                                    <CardTitle>Website Settings</CardTitle>
                                </div>
                                <CardDescription>Configure your website tracking preferences.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Automatic HTTPS Redirect</Label>
                                        <p className="text-sm text-gray-500">
                                            Automatically redirect HTTP traffic to HTTPS
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Track Bot Traffic</Label>
                                        <p className="text-sm text-gray-500">
                                            Include bot and crawler traffic in analytics
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-gray-500" />
                                <CardTitle>Notification Preferences</CardTitle>
                            </div>
                            <CardDescription>Choose what notifications you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-gray-500">
                                        Receive daily analytics summaries
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Traffic Alerts</Label>
                                    <p className="text-sm text-gray-500">
                                        Get notified of unusual traffic patterns
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Key className="h-5 w-5 text-gray-500" />
                                    <CardTitle>Password</CardTitle>
                                </div>
                                <CardDescription>Change your password.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current">Current Password</Label>
                                        <Input id="current" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="new">New Password</Label>
                                        <Input id="new" type="password" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="confirm">Confirm Password</Label>
                                        <Input id="confirm" type="password" />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                                        Update Password
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-gray-500" />
                                    <CardTitle>Two-Factor Authentication</CardTitle>
                                </div>
                                <CardDescription>Add an extra layer of security to your account.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label>Enable 2FA</Label>
                                        <p className="text-sm text-gray-500">
                                            Protect your account with two-factor authentication
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Moon className="h-5 w-5 text-gray-500" />
                                <CardTitle>Theme Settings</CardTitle>
                            </div>
                            <CardDescription>Customize the appearance of your dashboard.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Dark Mode</Label>
                                    <p className="text-sm text-gray-500">
                                        Switch between light and dark themes
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Label>Compact Mode</Label>
                                    <p className="text-sm text-gray-500">
                                        Reduce spacing between elements
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
