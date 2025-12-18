import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Slider,
    FormControlLabel,
    Checkbox,
    Grid,
    Chip,
    Alert,
    CircularProgress,
    Divider,
    IconButton,
    useTheme,
    alpha,
    Fade,
    Slide,
    LinearProgress,
    Tooltip
  
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ITeamData, ITeamEvaluation } from '../types';

// Form data interface
interface EvaluationFormData {
  descriptionMatch: number;
  deployment: number;
  businessValue: number;
  execution: number;
  presentation: number;
  overall: number;
  usesGemini: boolean;
  usesAI: boolean;
  isAgent: boolean;
  predeveloped: boolean;
  changedIdea: boolean;
  remarks: string;
  leadPresent: boolean;
  member1Present: boolean;
  member2Present: boolean;
  member3Present: boolean;
  
}

// Default form values
const defaultValues: EvaluationFormData = {
  descriptionMatch: 5,
  deployment: 5,
  businessValue: 5,
  execution: 5,
  presentation: 5,
  overall: 50,
  usesGemini: false,
  usesAI: false,
  isAgent: false,
  predeveloped: false,
  changedIdea: false,
  remarks: '',
  leadPresent: false,
  member1Present: false,
  member2Present: false,
  member3Present: false
  
};

// Progress Indicator Component
const ProgressIndicator = React.memo(({ 
  totalPoints, 
  maxPoints, 
  completionPercentage 
  
}: { 
  totalPoints: number;
  maxPoints: number;
  completionPercentage: number;
  
}) => {
   const theme = useTheme();
   
   const progressColor = React.useMemo(() => {
     if (completionPercentage >= 80) return { text: theme.palette.success.main, bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' };
    if (completionPercentage >= 60) return { text: theme.palette.warning.main, bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' };
    return { text: theme.palette.error.main, bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' };
  }, [completionPercentage, theme]);

  return (
    <Box sx={{ mb: 4, p: 3, backgroundColor: alpha(theme.palette.success.main, 0.05), borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Total Score: {totalPoints}/{maxPoints}
        </Typography>
        <Typography 
          variant="h6" 
          fontWeight={600}
          sx={{ color: progressColor.text }}
        >
          {Math.round(completionPercentage)}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={completionPercentage} 
        sx={{ 
          height: 8, 
          borderRadius: 4,
          backgroundColor: alpha(theme.palette.grey[300], 0.5),
          '& .MuiLinearProgress-bar': {
            background: progressColor.bg
  
          }
        }} 
      />
    </Box>
  );
});

// Smooth Slider Component
const SliderCriterion = React.memo(({ 
  title, 
  value, 
  onChange, 
  maxPoints = 10, 
  icon,
  name,
  control 
  
}: { 
  title: string; 
  value: number;
  onChange?: (value: number) => void;
  maxPoints?: number; 
  icon?: React.ReactNode;
  name: string;
  control: any;
  
}) => {
  const theme = useTheme();
  
  const getScoreColor = (val: number) => {
    const percentage = val / maxPoints;
    if (percentage >= 0.8) return { 
      bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', 
      track: theme.palette.success.main
  
    };
    if (percentage >= 0.6) return { 
      bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', 
      track: theme.palette.warning.main
  
    };
    return { 
      bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', 
      track: theme.palette.error.main
  
    };
  };
  
  const colors = getScoreColor(value);
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography variant="h6" fontWeight={600}>
          {title}
        </Typography>
        <Chip 
          label={`${Math.round(value)}/${maxPoints}`} 
          size="small" 
          sx={{ 
            ml: 'auto',
            background: colors.bg,
            color: 'white',
            fontWeight: 600
  
          }} 
        />
      </Box>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <Slider
            {...field}
            min={0}
            max={maxPoints}
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-track': {
                backgroundColor: colors.track
  
              },
              '& .MuiSlider-thumb': {
                backgroundColor: colors.track
  
              }
            }}
          />
  
        )}
      />
    </Box>
  );
});

const TeamEvaluation: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [teamNumber, setTeamNumber] = useState('');
  const [teamData, setTeamData] = useState<ITeamData | null>(null);
  const [teamDocId, setTeamDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // React Hook Form setup
  const { control, handleSubmit, reset, watch } = useForm<EvaluationFormData>({
    defaultValues,
    mode: 'onChange' // Enable real-time validation and updates
  
  });
   // Watch all form values for real-time calculations
   const watchedValues = useWatch({ control });
   
   // Calculate totals in real-time
   const totalPoints = React.useMemo(() => {
     const { descriptionMatch, deployment, businessValue, execution, presentation, overall } = watchedValues;
    return (descriptionMatch || 0) + (deployment || 0) + (businessValue || 0) + (execution || 0) + (presentation || 0) + (overall || 0);
  }, [watchedValues]);
  
  const maxPoints = 150;
  const completionPercentage = React.useMemo(() => (totalPoints / maxPoints) * 100, [totalPoints]);

  const fetchTeamData = async () => {
    if (!teamNumber.trim()) {
      setError('Please enter a team number');
      return;
  
    }

    setLoading(true);
    setError('');
    setTeamData(null);
    setTeamDocId(null);

    try {
      const teamsQuery = query(
        collection(db, 'teams'),
        where('teamNumber', '==', teamNumber.trim())
      );
      
      const querySnapshot = await getDocs(teamsQuery);
      
      if (!querySnapshot.empty) {
        const teamDoc = querySnapshot.docs[0];
        const data = teamDoc.data() as ITeamData;
        setTeamData(data);
        setTeamDocId(teamDoc.id);
  
      } else {
        setError('Team not found');
  
      }
    } catch (err) {
      console.error('Error fetching team:', err);
      setError('Error fetching team data');
  
    } finally {
      setLoading(false);
  
    }
  };

  const onSubmit = async (data: EvaluationFormData) => {
    if (!teamData || !user || !teamDocId) return;

    setSubmitting(true);
    
    try {
      const evaluation = {
        evaluatedBy: {
          uuid: user.uid,
          email: user.email
  
        },
        evaluation: {
          descriptionMatch: data.descriptionMatch,
          deployment: data.deployment,
          businessValue: data.businessValue,
          execution: data.execution,
          presentation: data.presentation,
          overall: data.overall,
          usesGemini: data.usesGemini,
          usesAI: data.usesAI,
          isAgent: data.isAgent,
          predeveloped: data.predeveloped,
          changedIdea: data.changedIdea,
          remarks: data.remarks
  
        },
        leadPresent: data.leadPresent,
        member1Present: data.member1Present,
        member2Present: data.member2Present,
        member3Present: data.member3Present,
        totalPoints,
        assessedAt: new Date()
      };

      const evaluationDocRef = doc(db, 'team-evaluations', teamDocId);
      const evaluationDoc = await getDoc(evaluationDocRef);

      if (evaluationDoc.exists()) {
        await updateDoc(evaluationDocRef, {
          evaluations: arrayUnion(evaluation),
          lastUpdated: new Date()
  
        });
      } else {
        const newEvaluation: ITeamEvaluation = {
          teamNumber: teamData.teamNumber,
          teamName: teamData.teamName,
          teamIdea: teamData.ideaDescription,
          evaluations: [evaluation],
          createdAt: new Date(),
          lastUpdated: new Date()
  
        };
        
        await setDoc(evaluationDocRef, newEvaluation);
      }

      // Reset form and clear team data
      reset(defaultValues);
      setTeamData(null);
      setTeamDocId(null);
      setTeamNumber('');
      setError('');
      
    } catch (err) {
      console.error('Error submitting assessment:', err);
      setError('Error submitting assessment');
  
    } finally {
      setSubmitting(false);
  
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(120, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
  
        }
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
  
              }}
            >
              Team Evaluation
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Comprehensive assessment platform for innovative AI projects
            </Typography>
          </Box>
        </Fade>

        {/* Team Search */}
        <Slide direction="up" in timeout={800}>
          <Paper 
            sx={{ 
              p: 4, 
              mb: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: `2px solid ${searchFocused ? theme.palette.primary.main : 'transparent'}`,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <SearchIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
              <Typography variant="h5" fontWeight={600}>
                Find Team
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                label="Team Number"
                placeholder="Enter team number (e.g., T001)"
                value={teamNumber}
                onChange={(e) => setTeamNumber(e.target.value)}
                variant="outlined"
                size="large"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onKeyPress={(e) => e.key === 'Enter' && fetchTeamData()}
                sx={{ flexGrow: 1 }}
                InputProps={{
                  sx: {
                    fontSize: '1.125rem',
                    fontWeight: 500
  
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={fetchTeamData}
                disabled={loading}
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600
  
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
  
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
  
            )}
          </Paper>
        </Slide>

        {/* Team Information and Evaluation */}
        {teamData && (
          <Fade in timeout={1000}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={4}>
                {/* Team Info Section */}
                <Grid item xs={12} lg={5}>
                  <Card
                    sx={{
                      height: 'fit-content',
                      position: 'sticky',
                      top: 20,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)'
  
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <GroupIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                        <Typography variant="h5" fontWeight={600}>
                          Team Information
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          TEAM NUMBER
                        </Typography>
                        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {teamData.teamNumber}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                          TEAM NAME
                        </Typography>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {teamData.teamName}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                          IDEA TITLE
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {teamData.ideaTitle}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 3 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <LightbulbIcon sx={{ color: theme.palette.secondary.main, fontSize: 24 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Idea Description
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        sx={{ 
                          lineHeight: 1.7,
                          p: 3,
                          backgroundColor: alpha(theme.palette.grey[100], 0.5),
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`
                        }}
                      >
                        {teamData.ideaDescription}
                      </Typography>

                      <Divider sx={{ my: 3 }} />

                      {/* Team Members */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <PersonIcon sx={{ color: theme.palette.info.main, fontSize: 24 }} />
                        <Typography variant="h6" fontWeight={600}>
                          Team Members
                        </Typography>
                      </Box>
                      
                      {/* Team Lead */}
                      <Box sx={{ mb: 3, p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Chip 
                            label="Team Lead" 
                            size="small" 
                            sx={{ 
                              background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                              color: 'white',
                              fontWeight: 600
  
                            }} 
                          />
                          <Typography variant="subtitle1" fontWeight={600}>
                            {teamData.lead.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {teamData.lead.institution} • {teamData.lead.city}, {teamData.lead.state}
                        </Typography>
                        <Controller
                          name="leadPresent"
                          control={control}
                          render={({ field }) => (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  sx={{
                                    '&.Mui-checked': {
                                      color: theme.palette.success.main
  
                                    }
                                  }}
                                />
                              }
                              label={
                                <Typography variant="body2" fontWeight={500}>
                                  Present during evaluation
                                </Typography>
                              }
                            />
  
                          )}
                        />
                      </Box>

                      {/* Other Members */}
                      {teamData.members.map((member, index) => (
                        <Box key={index} sx={{ mb: 3, p: 3, backgroundColor: alpha(theme.palette.grey[100], 0.3), borderRadius: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Chip 
                              label={`Member ${index + 1}`} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                            <Typography variant="subtitle1" fontWeight={600}>
                              {member.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {member.institution} • {member.city}, {member.state}
                          </Typography>
                          <Controller
                            name={`member${index + 1}Present` as any}
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    {...field}
                                    checked={field.value}
                                    sx={{
                                      '&.Mui-checked': {
                                        color: theme.palette.success.main
  
                                      }
                                    }}
                                  />
                                }
                                label={
                                  <Typography variant="body2" fontWeight={500}>
                                    Present during evaluation
                                  </Typography>
                                }
                              />
  
                            )}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Evaluation Form */}
                <Grid item xs={12} lg={7}>
                  <Card
                    sx={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)'
  
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <AssessmentIcon sx={{ color: theme.palette.success.main, fontSize: 28 }} />
                        <Typography variant="h5" fontWeight={600}>
                          Evaluation Criteria
                        </Typography>
                      </Box>

                      {/* Progress Indicator */}
                      <ProgressIndicator 
                        totalPoints={totalPoints}
                        maxPoints={maxPoints}
                        completionPercentage={completionPercentage}
                      />

                      <Grid container spacing={4}>
                        {/* Scoring Criteria */}
                        <Grid item xs={12} md={6}>
                          <SliderCriterion
                            title="Idea Clarity & Match"
                            value={watchedValues.descriptionMatch || 5}
                            name="descriptionMatch"
                            control={control}
                            icon={<LightbulbIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />}
                          />
                          
                          <SliderCriterion
                            title="Deployment Quality"
                            value={watchedValues.deployment || 5}
                            name="deployment"
                            control={control}
                            icon={<CheckCircleIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />}
                          />
                          
                          <SliderCriterion
                            title="Business Value"
                            value={watchedValues.businessValue || 5}
                            name="businessValue"
                            control={control}
                            icon={<AssessmentIcon sx={{ color: theme.palette.warning.main, fontSize: 20 }} />}
                          />
                          
                          <SliderCriterion
                            title="Technical Execution"
                            value={watchedValues.execution || 5}
                            name="execution"
                            control={control}
                            icon={<CheckCircleIcon sx={{ color: theme.palette.info.main, fontSize: 20 }} />}
                          />
                          
                          <SliderCriterion
                            title="Presentation Quality"
                            value={watchedValues.presentation || 5}
                            name="presentation"
                            control={control}
                            icon={<PersonIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />}
                          />
                          
                          <SliderCriterion
                            title="Overall Rating"
                            value={watchedValues.overall || 50}
                            name="overall"
                            control={control}
                            maxPoints={100}
                            icon={<AssessmentIcon sx={{ color: theme.palette.error.main, fontSize: 20 }} />}
                          />
                        </Grid>

                        {/* Additional Criteria & Remarks */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            Technology Assessment
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                            {[
                              { key: 'usesGemini', label: 'Using Gemini/Jules/Stitch/Antigravity?' },
                              { key: 'usesAI', label: 'Using other AI Tools?' },
                              { key: 'isAgent', label: 'Is Agent-based solution?' },
                              { key: 'predeveloped', label: 'Looks pre-developed?' },
                              { key: 'changedIdea', label: 'Changed idea during event?' }
  
                            ].map((item) => (
                              <Controller
                                key={item.key}
                                name={item.key as any}
                                control={control}
                                render={({ field }) => (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        {...field}
                                        checked={field.value}
                                        sx={{
                                          '&.Mui-checked': {
                                            color: theme.palette.primary.main
  
                                          }
                                        }}
                                      />
                                    }
                                    label={
                                      <Typography variant="body1" fontWeight={500}>
                                        {item.label}
                                      </Typography>
                                    }
                                    sx={{
                                      p: 2,
                                      borderRadius: 2,
                                      border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                                      backgroundColor: field.value ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
  
                                      }
                                    }}
                                  />
                                )}
                              />
                            ))}
                          </Box>

                          <Typography variant="h6" gutterBottom fontWeight={600}>
                            Judge's Remarks
                          </Typography>
                          <Controller
                            name="remarks"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Detailed feedback and comments"
                                multiline
                                rows={8}
                                fullWidth
                                variant="outlined"
                                placeholder="Provide detailed feedback on the team's performance, innovation, presentation quality, and any other observations..."
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: alpha(theme.palette.grey[50], 0.5)
  
                                  }
                                }}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 4 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                          <Typography variant="h5" fontWeight={600} gutterBottom>
                            Ready to Submit?
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Score: {totalPoints}/{maxPoints} points ({Math.round(completionPercentage)}%)
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Tooltip title="Reset all fields">
                            <IconButton 
                              onClick={handleReset}
                              sx={{
                                backgroundColor: alpha(theme.palette.grey[200], 0.5),
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.grey[300], 0.7)
  
                                }
                              }}
                            >
                              <RefreshIcon />
                            </IconButton>
                          </Tooltip>
                          
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} /> : <SaveIcon />}
                            sx={{
                              minWidth: 200,
                              py: 2,
                              fontSize: '1rem',
                              fontWeight: 600,
                              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
  
                              }
                            }}
                          >
                            {submitting ? 'Submitting...' : 'Submit Assessment'}
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </form>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default TeamEvaluation;
